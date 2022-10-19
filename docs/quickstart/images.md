# Container Image Registry

Images are stored directly in kraud object storage instead of being pulled on each pod start.
This behaves differently than kubernetes, which pulls images on every start.

Image objects are refferenced by pods using their database id instead of name, which has the advantage that pods remain reproducable even if you upload a different image with the same name.
However, the user experience is currently not the best, and it may be a bit confusing at times.



## managing images

=== "docker"

    docker supports images natively, so the regular image commands work out of the box

    ```sh
    docker images
    docker pull nginx
    docker rmi nginx
    ```

=== "kubectl"

    kubernetes does not have a native concept of images, so we added a new custom image type. This is currently very confusing and its recommended to use docker instead to manage images.

    ```yaml title="example.yaml"
    ---
    apiVersion: v1
    kind: Image
    metadata:
      name: nginx
    spec:
      ref: nginx
    ---
    ```
    ```bash
    kubectl apply -f example.yaml
    kubectl get images
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


you can copy any image you built locally to the cloud using


=== "docker"


    ```sh
    docker --context default save myimage | docker --context kraud.myorg load
    ```
