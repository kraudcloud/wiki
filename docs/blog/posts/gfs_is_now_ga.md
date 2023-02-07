---
date: 2022-01-31
authors: [aep]
categories:
 - announcements
---


# global file system is now generally available


Global file system can be mounted simultaneously on multiple containers,
enabling easy out of the box shared directories between services.

Similar to NFS, it does make files available over the network,
but GFS is fully managed and does not have a single point of failure.
It is also significantly faster than NFS due to direct memory access in [virtiofs](https://virtio-fs.gitlab.io/).


```sh
docker volume create shared --driver gfs
docker run -ti -v shared:/data alpine
```


## Coherent filesystem for horizontal scaling

GFS enables an application developer to start multiple instances of the same application,
without implementing synchronization. This is specifically useful for traditional stacks like PHP where
horizontal scaling requires a separate network storage.

Any docker container works with GFS without changes. The same standard syntax used to mount volumes on your local computers dockers will simply work in the cloud.


## Shared object storage for multiple services

Modern applications often choose to store shared files in object storages, specifically s3.
With GFS, you can simply store a file using unix file semantics without the need for a separate layer. 

File i/o behaves identical using a docker volume on your local machine, and with kraud. This makes developing apps locally and deploying into the kraud seamless.


## Built in redundancy by ceph

GFS is backed by [cephfs](https://docs.ceph.com/en/quincy/cephfs/index.html) on a 3 times redundant SSD cluster. Ceph is an open source object storage cluster backed by redhat, CERN and others. All pods/containers launched in the Falkenstein DC enjoy a 20MB/s transfer rate.

Users with hybrid regions should note that GFS data transfer counts towards external traffic.

Additionally, customers may choose a separate cluster for large intermediate data on magnetic disks.
This is intended for science applications working with large data sets and can easily scale to multiple petabytes.

[see the documentation for details](/quickstart/volumes/)

