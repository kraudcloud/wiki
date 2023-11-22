---
date: 2023-11-22
authors: [aep]
categories:
 - tech
---


# exclusive worker tokens with NATS

At kraud we of course use several orchestration engines.
During the process or retiring Hashicorp Nomad, a few new exciting things are created that i hope to open source soon.

The core of it is a bunch of workers, and items to be worked on. A fairly standard work queue situation.
Currently everything is built around notifying a worker through redis, and then holding a lock in redis for that particular resource.
Redis is doing a great job at all of that, but somehow i felt like exploring the new(ish) thing for reliable notifications:
[nats.io](https://nats.io/)'s jetstream and then realized that nats can now also do locks!


## locking with nats.io

the [maintainers comment here]( https://github.com/nats-io/nats-server/discussions/4803#discussioncomment-7612323)   describes the solution to building a lock with NATS. 

The idea is to have a stream with DiscardNewPerSubject, which prevents new items being published to a key already holding a value.


```sh

nats stream add  work --defaults --discard-per-subject \
    --subjects='locks.*' --storage=memory \
    --discard=new   --max-msgs-per-subject=1

nats req locks.bob red # lock
nats req locks.bob red # will fail

nats stream rmm locks 1 #clear the lock

```

in a distributed system you would also have to think about expiry and refreshing, which would be done with with the MaxAge stream setting.
but then exactly what i hoped for had happened: i discovered an entirely new method of building workers in the design of nats.


## exclusive work tokens

in addition to locks, you would also have to notify a worker that new work is available, something trivially done in either redis or nats
although i feel like nats has a slight edge here because it can actually guarantee that a message is delivered with jetstream, which simplifies
retry on the application side.

But what if we just notified _one_ worker and then made sure to not notify any other worker until the first one is done.
That's essentially a classic token ring,bus,whatever architecture where a token is handed around that makes
the holder eligible for accessing a shared resource. 

We already have that thing in the previous step. Just have to use it the _other way around_.


```
nats stream add  work --defaults --discard-per-subject \
    --subjects='work.*' --storage=memory \
    --discard=new  --max-msgs-per-subject=1 \
    --retention=work
```


the first difference is retention=work, which says that any acked message is discarded.
since we only allow one item per subject , this means the subject is blocked until it is acked.

now instead of locking an item from the worker, we push the work into the subject from the requester

```
nats req work.car1 paint # ok
nats req work.car2 paint # ok
nats req work.car1 tires # nope, car1 is already being worked on
```

workers then consume work items

```

nats con add work worker --ack=all --wait=5s --target="worker" --defaults --deliver-group=workers

nats sub worker --queue=workers
nats sub worker --queue=workers

```

nats will deliver the message to only __one__ random worker. If the worker fails to ack the work in time,
it is redelivered again to a random worker until an ack finally clears the message.
Since we only allow one message per subject to be queued, this means only one worker will ever work on it.
Of course the worker can receive work on other subjects in the meantime, just not on this one.

In this cli example the timeout is fixed, and the worker cannot really tell nats to hold back redelivery until its done, 
but i'll get to a full code example in a second where it can.


## but queueing?

Most of the time you just want to set-and-forget work items into a queue and not wait for the workers to be available.
nats has enother elegant construct we can use for that: [sources](https://docs.nats.io/nats-concepts/jetstream/streams#sources)

We can just have another stream that allows more than one message per subject

```
nats stream add  inbox --defaults --discard-per-subject \
    --subjects='work.*' --storage=memory \
    --discard=new  --max-msgs-per-subject=10
```

and then create the work stream with that one as source

```
nats stream add  work --defaults --discard-per-subject \
    --source='inbox' --storage=memory \
    --discard=new  --max-msgs-per-subject=1 \
    --retention=work
```


now publishing multiple work items on the same subject is allowed

```
nats req work.car1 paint # ok
nats req work.car1 tires # ok
nats req work.car1 battery # ok
```

yet, only one will be actually worked on at a time

```
nats stream report
╭─────────────────────────────────╮
│              Stream Report      │
├──────────┬───────────┬──────────┤
│ Stream   │ Consumers │ Messages │
├──────────┼───────────┼──────────┤
│ work     │         1 │ 1        │
│ inbox    │         0 │ 3        │
╰──────────┴───────────┴──────────╯
```


once the item in work is acked, nats will automatically feed the next one.


## implementation in go


now as promised, here's a complete example in golang including the ability to hold an item in the queue
for longer than its ack timeout.

```go
package main

import (
	"fmt"
	"github.com/nats-io/nats.go"
	"time"
)

func InitNats() {
	nc, err := nats.Connect("localhost")
	if err != nil {
		panic(err)
	}
	defer nc.Close()

	js, err := nc.JetStream()
	if err != nil {
		panic(err)
	}

	// first create an inbox queue holding the latest state of work to be done
	// values in here are replaced when new work on the same topic is submitted
	_, err = js.AddStream(&nats.StreamConfig{
		Name:     "inbox",
		Subjects: []string{"inbox.*"},

		MaxMsgsPerSubject: 1,
		Discard:           nats.DiscardNew,
	})
	if err != nil {
		panic(fmt.Sprintf("Error creating jetstream [needs a nats-server with -js] : %v", err))
	}

	// items are moved from the inbox into a token lock.
	// these are held by a worker until its done and only THEN a new value is pulled from the inbox.
	// if the worker fails to ack the item, it is resent to a different worker
	_, err = js.AddStream(&nats.StreamConfig{
		Name: "work",
		Sources: []*nats.StreamSource{
			{
				Name: "inbox",
			},
		},

		MaxMsgsPerSubject: 1,
		Discard:           nats.DiscardNew,

		// this means you cant update a running token
		DiscardNewPerSubject: true,

		// an ack deletes the message and frees the topic for new work
		Retention: nats.WorkQueuePolicy,
	})
	if err != nil {
		panic(fmt.Sprintf("Error creating jetstream [needs a nats-server with -js] : %v", err))
	}

	// push the token into a delivery group
	_, err = js.AddConsumer("work", &nats.ConsumerConfig{
		Durable:        "work",
		DeliverSubject: "work",
		DeliverGroup:   "workers",
		DeliverPolicy:  nats.DeliverAllPolicy,
		AckPolicy:      nats.AckExplicitPolicy,
		AckWait:        30 * time.Second,
		Heartbeat:      time.Second,
	})
	if err != nil {
		panic(fmt.Sprintf("Error creating jetstream consumer : %v", err))
	}

	ch := make(chan *nats.Msg, 64)
	nc.ChanQueueSubscribe("work", "workers", ch)

	for msg := range ch {

		if len(msg.Reply) == 0 {
			// not jetstream, probably keepalive
			continue
		}

		fmt.Println(msg.Reply)

		fmt.Printf("Received a message on %s: %s\n", msg.Subject, string(msg.Data))
		go func(msg *nats.Msg) {
			for i := 0; i < 60; i++ {
				fmt.Println("working...")
				rsp, err := nc.Request(msg.Reply, []byte("+WPI"), time.Second)
				if err != nil {
					// lost lock, stop immediately or we risk working in parallel
					panic(err)
				}
				fmt.Println("got in progress response", string(rsp.Data))
				time.Sleep(1 * time.Second)
			}
			fmt.Println("done")
			msg.Ack()
		}(msg)
	}
}
```


