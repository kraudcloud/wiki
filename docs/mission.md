# Mission Statement



We're offering managed kubernetes for free, in Europe, in the middle of an energy crisis, with zero venture funding.
This is a big leap towards a bigger goal:

We want to take a shot at big tech cloud services with an alternative that is

 - a customer-focused business away from the usual capital (mis)allocators
 - with 80% lower energy usage, 100% renewables
 - local / hybrid by default with hardware under user control


## Energy


[According to the FT](https://www.ft.com/content/0c69d4a4-2626-418d-813c-7337b8d5110d) Big tech uses roughly as much energy as New Zealand.
Imagine if we could save 80% of that.

Since we're accepting zero venture funding, we won't get there without you, the customers.

Here is how you can help us reach that goal:

 1. use free carbon neutral managed k8s
 2. enable auto suspend rules for containers you dont need all the time.
 3. buy powerups. we scale pricing according to energy use.
 4. switch to arm containers for higher power efficiency
 5. once we have enough customers, we can start vertical building integration using DC power


Why would you want to manage an entire k8s cluster with 3 managment nodes sitting idle,
when you can get a free control plane and still isolated private workload pods.


## Hybrid

In 2022, it's become an actual credible risk that some billionaire might just buy your cloud provider for fun (?). Weird times.

Kraud is built with hybrid cloud in mind. We're no big tech venture seeking to monopolize the worlds data.
Building our own datacenters is a major part of achieving 80% energy saving,
but having your own hardware in your own building has its own set of advantages.


## Architecture

how is this even possible?

The architectural invention starts with not actually using kubernetes.
We just fake the api for your convenience. Pods are actually implemented as micro-vms with an AMD SEV hypervisor barrier on an HPC cluster.

If you're used to kubernetes, this may be confusing because some endpoints don't actually return any data that makes sense.
For example nodes returned on kubectl aren't real nodes. We don't actually expose real hardware in any way because it might not be real!
Your container could run on your phone, transparently.

Your VPC inter-pod network is also entirely private using wireguard to protect against physical intrusion.

The control plane is a proprietary multi-tenancy distributed machine somewhat inspired by the original google borg.

This may lead to a bumpy experience in early stages where we're not done emulating all of the k8s apis,
but in turn has the advantage that we also emulate other apis for the same virtual cluster, such as docker swarm.
You can use all of these tools with the same cluster.

Clusters can be as small as 1GB of memory, with the control plane not using any of that.
The theoretical cluster size limit is 100 Petabyte of main memory, but in practice we currently can't offer more than 1TB due to hardware cost.

