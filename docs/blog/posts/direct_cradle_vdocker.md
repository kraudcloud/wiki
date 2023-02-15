---
date: 2023-02-15
authors: [aep]
categories:
 - tech
---


# vdocker moved to cradle

Vdocker is how we call the thing that responds to docker api calls like log, attach, exec and cp.

Vdocker used to run on the host, and all the commands where carefully funneled through a virtio-serial.
The advantage is that cradle is small, and starts faster. However, we realized most people do start fairly large containers that
take a few seconds to start anyway. Hence sub-100ms startup time for cradle is no longer a priority

Instead we traded a few milliseconds of start time for much higher bandwidth by moving vdocker directly into cradle.
It listens inside of your pod on port 1 and accepts the nessesary docker commands from the api frontend.
`docker cp` now works properly and is much faster. Also `docker attach` no longer glitches.

Unfortunately this means `docker run`  feels slower, although it really hasnt changed much.
Log output starts appearing roughly 80ms after download completed, but for larger container it may take several seconds to download layers,
which you can currently not see.

On the upside, all *other* commands now feel alot faster, because we skip vmm and just proxy the http call directly to vdocker.

