# Persistence

there are currently 3 types of storage:

#### nfs: shared file system

File volumes behave like docker host mounts and are fully managed for you including redundancy and backups.
They can be accessed by multiple pods simultaneously and support concurrent read/writes to some degree.
This is useful for configs and other shared data that doesn't have high performance requirements.
Since the intent is to emulate docker volume behavior, this is the default choice if you don't know which volume type you need.

#### lv2: local nvme

LV2 is exposed as block storage to the vm.
Usually it will be automatically formated and mounted as ext4 but can also be used as raw block device available in /dev/volumes/ by not specifying any volumeMounts.
Note that directly attached storage is not highly available. In case of a host failure there's a manual recovery process involved that
will be executed whenever the host is back. users of lv2 should prepare for that scenario.



## creating your first volume

=== "kra"

    docker supports volumes natively, and the compose spec works out of the box

    ```{.yaml title=docker-compose.yaml}
    version: "3.9"

    volumes:
      example:
        driver: nfs
        driver_opts:
            size: 10G
    
    services:
      nginx:
        image: ubuntu
        volumes:
          - example:/data

    ```

    ```sh
    kra up
    ```


=== "docker"

    docker supports volumes natively, and the cli works out of the box

    ```sh
    docker volume create example --driver nfs
    docker run -v example:/data -ti ubuntu
    ```
    ```sh
    root@warmhearted_snow:/# mount | grep /data
    fs0 on /data type virtio (rw,relatime)
    root@warmhearted_snow:/# df -h | grep data
    /dev/volumes/example  9.8G   28K  9.3G   1% /data
    ```

## managing volumes

=== "kra"

    ```sh
    kra vol
    ```

=== "docker"

    ```sh
    docker --context kraud.cloud volume ls
    ```



## WebDAV Access

volumes can be accessed via webdav via https://files.kraudcloud.com or davs://files.kraudcloud.com depending on your client.

You will find username/password in your [profile](https://kraudcloud.com/profile) under "Files Login".





