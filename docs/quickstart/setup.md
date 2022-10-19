

# Setup

kraud supports both the docker and kubernetes api at the same time in the same cluster.
You can mix and match the tools that best for your workflow.

To access the control plane, login to [https://kraudcloud.com](https://kraudcloud.com) and download the credentials from your account profile.
It's a zip file containing client certificates and instructions how to set up docker and kubectl.
Note that clicking the download link also invalidates any existing kraud credential you may have downloaded previously.

![login animation](login.gif)


## using the kraud remote context

=== "docker"

    install the official docker cli from [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

    most docker commands work on kraud, but the docker cli is somewhat limited.

    You can use docker context use to quickly switch between the kraud remote context and your local docker (default).
    for other methods, [see the official docs](https://docs.docker.com/engine/context/working-with-contexts/#use-a-different-context)

    ```bash
    docker context use kraud.myuser
    docker info
    docker context use default
    docker info
    ```

=== "kubectl"

    install the official kubernetes tools from [https://kubernetes.io/docs/tasks/tools/](https://kubernetes.io/docs/tasks/tools/)

    to switch contexts use

    ```bash
    kubectl config use-context kraud.myuser
    kubectl describe node
    ```

=== "compose"

    install the official docker cli from [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

    most compose commands work on kraud, but the docker cli is somewhat limited.

    You can use docker context use to quickly switch between the kraud remote context and your local docker (default).
    for other methods, [see the official docs](https://docs.docker.com/engine/context/working-with-contexts/#use-a-different-context)

    ```bash
    docker context use kraud.myuser
    docker info
    docker context use default
    docker info
    ```

=== "swarm"

    install the official docker cli from [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

    most swarm commands work on kraud, but the docker cli is somewhat limited.

    You can use docker context use to quickly switch between the kraud remote context and your local docker (default).
    for other methods, [see the official docs](https://docs.docker.com/engine/context/working-with-contexts/#use-a-different-context)

    ```bash
    docker context use kraud.myuser
    docker info
    docker context use default
    docker info
    ```



## starting your first pod/container

=== "docker"

    due to limitations with dockers attach api, every docker run command must use the -ti flags

    ```
    docker context use kraud.myuser
    docker run -ti ubuntu
    ```

    we're still trying to figure out how to properly support docker attached run (without -d).
    If you get disconnected, just reattach to the container with

    ```
    docker attach mycontainer
    ```


=== "kubectl"

    ```yaml title="example.yaml"
    ---
    apiVersion: v1
    kind: Image
    metadata:
      name: ubuntu
    spec:
      ref: ubuntu
    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name: ubuntu
    spec:
      containers:
      - name:  ubuntu
        image: ubuntu
    ---
    ```
    ```bash
    kubectl apply -f example.yaml
    kubectl logs -f ubuntu
    ```


=== "compose"

    ```yaml title="docker-compose.yaml"
    version: "3.9"
    services:
      nginx:
        image: "nginx"
    ```
    
    ```bash
    docker compose up
    ```

=== "swarm"

    ```yaml title="docker-compose.yaml"
    version: "3.9"
    services:
      nginx:
        image: "nginx"
    ```
    
    ```bash
    docker stack deploy -c ./docker-compose.yaml mystack
    docker stack ls
    ```
