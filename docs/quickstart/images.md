# Container Image Registry

Images are stored directly in kraud object storage instead of being pulled on each pod start.
This behaves differently than kubernetes, which pulls images on every start.

Image objects are referenced by pods using their database id instead of name, which has the advantage that pods remain reproducable even if you upload a different image with the same name.
However, the user experience is currently not the best, and it may be a bit confusing at times.



## managing images

=== "kra"

    kra offers basic remote image managment,
    but docker cli might be required for some actions for now.

    ```sh
    kra images ls
    ```
=== "docker"

    docker supports images natively, so the regular image commands work out of the box

    ```sh
    docker images
    docker pull nginx
    docker rmi nginx
    ```

=== "compose"

    docker supports images natively, so the regular image commands work out of the box

    ```sh
    docker images
    docker pull nginx
    docker rmi nginx
    ```


=== "swarm"

    docker supports images natively, so the regular image commands work out of the box

    ```sh
    docker images
    docker pull nginx
    docker rmi nginx
    ```

## importing locally built images


you can copy any image you built locally to the cloud using kra push.


```sh
docker build . -t myapp
kra push myapp
```

