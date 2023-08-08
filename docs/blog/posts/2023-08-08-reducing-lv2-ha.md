---
date: 2023-08-08
authors: [aep]
categories:
 - product
---

# NFS is production ready | LV2 will have lower guarantees

This year we introduced NFS for highly available file volumes and LV2 for very fast local block storage.

## NFS is worry-free, just use NFS

NFS is sufficiently complete that its the second service to be marked production ready in the
[product specification](/product/specification/) and the first to come with a [money back guarantee](/product/sla/).
It is fully single-zone redundant with active/passive failover and automatic snapshots. This is the default storage everyone should be using.
It offers complete worry free file storage that works with most docker containers out of the box. NFS is also accessible via [webdav](http:/quickstart/volumes/#webdav-access) and S3.
This allows easy collaboration on file based workloads.

Later this year we're planning to make snapshots explicitly controlled by users, so that you can instantly rollback yourself instead of asking customer support to do it.


## LV2 requires special attention

Some customers prefer "virtual disks" instead of file storage. The primary advantage is that they're generally faster for single process workloads.
There are several different ways to implement "virtual disks". If a competitor does not tell you which technology they use,
it is very likely what we call LV1, that is locally redundant (RAID) storage directly attached to the host.
In case of a host failure, the volume becomes unavailable and the associated pod will not be rescheduled.

With LV2 we tried to approach similar high availability and guarantees to our HA system,
but ultimately the two worlds are just too dissimilar, and customers have much lower expectations.
Instead we are reducing high availability of LV2 for the benefit of **much quicker launch** times.
Users may choose to either restore from cold storage with a **Recovery Point Objective of 1 Hour**, or wait for manual recovery of the host (usually within a business day).

If you look out there you may notice that services like AWS EBS or Hetzners CEPH volumes offer much lower RPO than krauds LV2.
This is because they're network volumes, not directly attached. These products are very unpopular, so we currently do not offer them.
The primary disadvantage is that network storage has a significant latency penalty, at which point you might just use NFS.

However, if you would like to see zero RPO block volumes at kraud, let us know!
