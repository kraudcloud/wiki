---
date: 2023-03-26
authors: [aep]
categories:
 - tech
---

# Introducing local storage tier

we're adding a new storage tier: **LV**

kraud currently has 3 different storage types

 - GP:  our general purpose ceph cluster with 100TB of consumer grade SSDs.
 - GFS: global shared filesystem, very useful for just having files available in multiple pods concurrently. This is backed by GP with cephfs MD on top.
 - RED: a data garbage bin using 200TB of spining consumer disks. You should not be using this unless you want really cheap large slow storage.

The new LV tier will aid users of legacy applications that are built for more traditional virtual server deployments.
It is backed by a raid 1 of enterprise NVME drives and peaks at 1 million IOPS.
A 4TB volume will have 3GB/s bandwidth dedicated and can request pcie passthrough for low latency, while smaller allocations share the bandwidth and IOPS.

Unlike GP, LV does not survive host failure, meaning a loss of a host will result in the volume becoming unavailable.
During the last (bad) month this would have resulting in a 99.1% uptime, unlike GP which had 99.9% uptime.
There's a residual risk of total loss, due to the nature of being electrically connected to the same chassis.
We advise users to build their own contingency plan, similar to what you should have done with competing virtual machine offers.

While LV has very little benefits in modern applications, it pairs well with traditional VMs and will become the default storage in the kraud marketplace for VMs.


## ceph let us down(time)

Most kraud users would rather not bother with details of how storage works. This is after all, what we've built kraud for.
However, as you noticed, we're not doing great in terms of uptime recently (still better than Azure, lol) and this is due to storage.
To reach our goal of carbon negative computing while also taking in zero venture funding, we must navigate the difficult path of
serving a variety of incompatible workloads.

Kraud is all about energy saving so we use lower clock EPYC cpus with the highest possible compute per energy efficiency.
Ceph was built for high clock speed XEONs with very little respect for energy efficiency, so it does not perform great in this scenario.

Adding to that, we treat physical servers as expendable and built all of our software for graceful recovery from loosing a node.
That allows building machines for a third of a cost of traditional OEMs like HP, etc.
We use things like cockroachdb, which performs well under frequent failures.
While ceph does also recover from such an event, it does NOT do it as graceful as you'd hope for,
resulting in several minutes of downtime for the entire cluster every time a single node fails.

As i keep saying, high availability is the art of turning a single node incident into a multi node incident.

In summary ceph is not the correct solution for the customer group that is currently the most important to the companies survival (paying customers, yes)
This is why we're moving that customer group away from ceph, so GFS can come back to its previously slow-but-stable glory.

In the future, once we become big enough, we hope to deliver a custom built storage solution that can work well within the energy targets.

Thank you for your patience and for joining us on this critical mission towards carbon negative compute.


