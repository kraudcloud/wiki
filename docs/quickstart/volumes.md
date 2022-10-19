# Persistence

there are currently 3 types of storage:

#### shared file system

File volumes behave like docker host mounts and are fully managed for you including redundancy and backups.
They can be accessed by multiple pods simultaneously and support concurrent read/writes to some degree.
This is useful for configs and other shared data that doesn't have high performance requirements.
Since the intent is to emulate docker volume behavior, this is the default choice if you don't know which volume type you need.

#### block storage

Block storage is network attached SSD from a ceph cluster.
It has redundant and has much better performance than file volumes.
Usually it will be automatically formated and mounted as ext4 but can also be used as raw block device available in /dev/volumes/ by not specifying any volumeMounts.
Note that block storage cannot migrate between datacenter segments. It can only be used by pods within the same segments.
Block storage is pre-allocated and immediately counts towards your plans storage limit when allocated.
It can be scaled up at any time by re-applying the object with a larger size.
To reduce the size of a volume you must delete and recreate it.

#### ephemeral nvme

The root filesystem is stored on pcie attached local nvme.
There is no redundancy and all data will be lost on pod restart or migration.
This is useful for caches which require very high write performance.


## creating your first volume

=== "docker"

    docker supports volumes natively, and the cli works out of the box

    ```sh
    docker volume create example
    docker run -v example:/data -ti ubuntu
    ```
    ```sh
    root@warmhearted_snow:/# mount | grep /data
    /dev/vdc on /data type ext4 (rw,nodev,relatime)
    root@warmhearted_snow:/# df -h | grep data
    /dev/volumes/example  9.8G   28K  9.3G   1% /data
    ```


=== "kubectl"

    k8s uses PersistentVolumeClaim to create volumes

    ```yaml title="example.yaml"
    ---
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: postgres
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 100G
      storageClassName: block
    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name: postgres
    spec:
      containers:
      - name:  postgres
        image: postgres
        volumeMounts:
        - mountPath: /var/lib/postgresql/data
          name: postgres
      volumes:
      - name: postgres
        persistentVolumeClaim:
          claimName: postgres
    ---
    ```
    ```bash
    kubectl apply -f example.yaml
    ```



=== "compose"

    docker supports volumes natively, and the compose spec works out of the box

    ```{.yaml title=docker-compose.yaml}
    version: "3.9"
    volumes:
      - example
    services:
      nginx:
        image: ubuntu
        volumes:
          - example:/data

    ```

    ```sh
    docker volume create example
    docker compose up -d
    docker volume inspect example
    ```

=== "swarm"

    docker supports volumes natively, and the compose spec works out of the box

    ```{.yaml title=docker-compose.yaml}
    version: "3.9"
    volumes:
      - example
    services:
      nginx:
        image: ubuntu
        volumes:
          - example:/data

    ```

    ```sh
    docker stack deploy -c ./docker-compose.yaml mystack
    docker volume inspect example
    ```


