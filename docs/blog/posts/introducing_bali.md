---
date: 2023-06-07
authors: [aep]
categories:
 - tech
 - opensource
---

# open sourcing kraud bali

github: [https://github.com/kraudcloud/bali](https://github.com/kraudcloud/bali)

Internally at kraud we use lots of things to deploy cloud and on-prem machines.
Old school dpkg and ansible is a whole different world than  docker, kubernetes, etc.

One of the things that’s been missing has been a thing in the middle, where we can configure and deploy services
in a consistent and repeatable way like docker, but without depending on high level services like docker being available yet.

## docker build is the standard

There is an uncountable amount of innovative approaches to building consistent system services, nix being a popular one for example.
But docker build is really the standard. It's not elegant, but it's simple, which is very important in an operational environment
where you need to quickly understand a large amount of moving parts while all the red alarm lights are blinking.

docker usually builds images in layers, which is an unfortunate design choice. distributing those layers also requires docker registry.
Registry is a docker container, with persistent storage. The recommended k8s architecture
is boostrapping k8s from a registry that runs on k8s. But i'd rather sleep well at night so we're not doing that.

Instead bali builds docker images to a single tarball. They can be distributed using fairly standard tools, even replicated.
They're also ephemeral, meaning no cleanup is required after run.

## signed images

security is critical in cloud operations. Users give up control over the low level infrastructure and in turn expect us to do it correctly of course.
docker content trust exists but it's ... weird and i'm not entirely sure if its even cryptographically correct.

Fortunately, single files are easy to sign, so bali signs any image it builds by default with a local ed25519 key.
The signature is embedded, so that the image still works as a normal tar.gz you can extract with any other tool.

bali run then can yolo-get images from any untrusted storage, but checks the signature on open.
This is convenient for us to make distribution of images as low-tech as possible, so we can rely on it to bootstrap higher level systems.

## zero isolation by design

docker was designed back when containers where not a thing really. it can keep poorly behaving software in check fairly well.
That plus it makes it very convenient for the user by hiding alot of complexity required to make that work.

When bootstrapping infrastructure, both of those features are counterproductive. While you can run docker with --net=host for example,
it still creates a namespace anyway, interfering with our own namespacing for vpcs. The only namespace we really want is for filesystem,
because it makes it convenient to just `apk add` dependencies without thinking of new build systems like nix.

An even bigger issue for us with docker was the daemon. When you do `docker run`, the calling process is really just an rpc client to the docker daemon,
which then runs the container. This means for example SIGKILL to the docker run process will _not_ kill the process. it will just kill the docker cli, leaving the
service dangling. Any cgroup limits etc also do not actually apply to the system service. docker has its own solutions for each managment task,
but they're often intended for developers rather than operators.

bali instead calls execve after its done with the setup.  It _becomes_ the process you originally wanted to run.
This means any context coming from the caller directly applies to the service, making bali work great inside systemd units, nomad, etc.


## alternatives

bali is trivial by design, only intended for our narrow use case. there are other systems for a wider use case.
For example consider systemd-nspawn for services that have a persistent root system on the same machine.

We're happy to share bali with the community, if its useful to anyone else.





