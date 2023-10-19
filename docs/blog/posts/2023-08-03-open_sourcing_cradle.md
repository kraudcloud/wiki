---
date: 2023-08-05
authors: [aep]
categories:
 - tech
---

# open sourcing kraud cradle


I'm super excited to announce that we're making the source code for our microvm launcher available to the public.
It's all out there in the [GitHub repo](https://github.com/kraudcloud/cradle)

## cradle, the green microvm pod launcher

Cradle is how we isolate pods from each other on the kraud platform using microvms in KVM.
The repo should contain enough of the host implementation to enable anyone to launch docker containers in isolation.

![bootup log](../../technology/boot.gif)


In contrast to other solutions such as firecracker, cradle is intended to run existing containers without changes.
Kraud is primarily focused on creating a docker like experience in the cloud, for maximum developer comfort.

It is not "cloud native" compliant and does not fit into the k8s ecosystem.
Instead cradles mission is to start a docker container within 100ms on an arbitrary host machine,
so we can schedule workloads dynamically without the massive economic and ecological cost of operating the
infrastructure usually required to do that.


## trust no cloud, verify and attest 

While this is cool and interesting tech, the primary purpose of publishing cradle as open source is to enable our customers
to verify the complete boot stack using AMD SNP. Everything that runs inside the VM is open and can be attested to be exactly what we claim it to be.

This in addition to purchasing on premise cloud machines enables our customers to enjoy the flexibility and comfort of a cloud
service while also staying in full control of their data.

Running an attested confidential docker container locally is a bit involved, since this is not intended as a finished product.

Assuming you have an SNP host setup:

```
sed -e 's/VARIANT=default/VARIANT=snp/g' -i Makefile
make
docker pull mariadb
kcradle summon /tmp/vm mariadb
ln -sf pkg-snp /tmp/vm/cradle
kcradle run /tmp/vm
```


For the high level confidential compute stack such as remote attestation, we recommend [enclaive](https://github.com/enclaive).


