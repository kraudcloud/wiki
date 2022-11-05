The [microvms](http://127.0.0.1:8000/technology/architecture/#microvms)
on kraud usually run inside some form of transparent memory encryption (subject to availability).

On x86 that's AMD Secure Encrypted Virtualization (SEV), protecting guest memory from other guests and from the hypervisor,
which a unique key only known to the guest.



## Hypervisor Interaction

virtual machines are called machines because they emulate machines (ah!),
but kraud does not emulate machines. microvms run an extremly stripped down version of linux that would not boot
on a regular machine. Vise versa, we cannot boot windows or windows-like systems for the same reason.

![boot.png](boot.png)


That has obvious advantages in terms of security. 
ACPI alone is [scary!](https://en.wikipedia.org/wiki/Advanced_Configuration_and_Power_Interface#Security_risks) so we just decided to not use it.
It's also slow, so good riddance. Neither does cradle use PCI, or discover anything at runtime.
The 'hardware' interfaces like network, layers, block storage are static and use a single static driver,
[virtio](https://www.linux-kvm.org/page/Virtio), in [mmio transport mode](https://docs.oasis-open.org/virtio/virtio/v1.1/csprd01/virtio-v1.1-csprd01.html#x1-1440002)


## SEV-SNP

Some customers may wish to go beyond that and use SEV-SNP, a new shiny version of SEV that enables remote attestation.
The purpose of remote attestation is to ensure that no mailicious code (backdoor) is running inside your container.

Most cloud providers will provide a way to easily use SNP attestation in a way that uses their cloud service as trust root.
We actively choose not to offer that for many reasons.

If you wish to implement SNP attestation yourself, have a go! The code running inside the vm is called cradle,
and fully documented, for you to review for backdoors and inject your own remote attestation mechanism.
