# Virtual Machines

while containers are the standard way of working with web applications,
kraud supports "virtual machines" similar to other cloud service providers
for legacy applications or developer convenience.

pvms are actually implemented exactly the same way as pods,
so that you can mix and match different components from the infrastructure

for example they are part of the same vpc network, and can use the same persistent storage methods.

## creating your first pvm

=== "kra"

    ```sh
    wget https://raw.githubusercontent.com/kraudcloud/apps/main/debian/12/docker-compose.yaml
    ```


    ```{.yaml title=docker-compose.yaml}
    version: "3.9"

    volumes:
      root:
        driver: lv2
        driver_opts:
          size: ${BOOT_SIZE}
          zone: ${ZONE}

    services:
      debian:
        restart: always
        image: quay.io/kraudcloud/pvm/debian:12
        build: .
        volumes:
          - root:/
        labels:
          - kr.res.mem=${MEM}
          - kr.zone=${ZONE}
          - kr.network.policy=open
    ```

    ```sh
    ZONE=uca BOOT_SIZE=100G MEM=16G kra up
    ```



=== "web ui"

    you may also head to the [marketplace](https://kraudcloud.com/marketplace) and launch one from there.

    these are the same as available in the [apps git repo](https://github.com/kraudcloud/apps)
