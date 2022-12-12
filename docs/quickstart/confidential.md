# Confidential Compute Containers

Pods running on x86_64 are created inside an AMD SME micro-vm, automatically encrypting your main memory at use.
You may additionally enable AMD SEV-SNP which allows features like remote attestation, but disables some other features, like gfs volumes.


!!! danger

    SEV-SNP is in development. pods launched with snp will be cleaned up regularly while we're changing functionality. Is is strongly recommended to join the discord channel to stay in touch with the development team.

!!! info

    the SNP bootup is significantly slower than kraud vmm and may lead to timeouts and errors. we'll be improving this if more users request this feature.

## launching pods with snp enabled

=== "docker"

    labeling your container with kr.res.snp=1

    ```sh
    docker run -ti -l kr.res.snp=1 ubuntu
    ```

    Will make /dev/snp-guest available.

## custom attestation

If you want to attest a pod _before_ it is launched using your own systems, you must supply a url to a self contained binary that does the attestation


=== "docker"
    ```
    docker run -ti \
        -l kr.res.snp=1 \
        -l kr.xcradle.url=https://my.external.site/attestation.elf \
        ubuntu
    ```

the official [amd guest owner documentation](https://github.com/AMDESE/sev-guest/blob/main/docs/guest-owner-setup.md) is unfortunately not very good, but users of the feature are currently expected to know what they're doing (tm).
We recommend [enclaive.io](https://enclaive.io/) as preferred partner for a ready made attestation service.

