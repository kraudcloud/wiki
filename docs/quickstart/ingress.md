# Accepting Incoming Connections

Pods are not directly exposed to the internet and do not have a public IP assigned. Instead they are connected to each other using a [wireguard](https://www.wireguard.com/) mesh network.

If you're familiar with docker networks or kubernetes, this will feel natural. The network is managed for you by the kraud control plane but does **not** intersect with other tenants networks. You cannot directly access a pod in a different account without going through a gateway.

Similarly you cannot directly acess pods from the internet. Instead we manage an ingress controller that routes traffics to your pods based on rules such as hostname and path.

## discovering your ingress

your cluster comes with a default ingress and domain managed by kraud.

currently kubectl is required to interact with the ingress.

=== "kubectl"

    to explore your default ingress, use

    ```sh
    kubectl describe ingress default
    ```

    find your ingress domain here


    ```{ .yaml hl_lines="4"}
    Name:             default
    Labels:           <none>
    Namespace:        default
    Address:          123123.1d.pt
    Default backend:
    TLS:
      SNI routes *.123123.1d.pt
    Rules:
      Host                  Path  Backends
      ----                  ----  --------
      files.123123.1d.pt
                            /   bountiful_paper:80 ()
    Annotations:            <none>
    Events:                 <none>

    ```

## routing your first service

=== "docker"

    docker does not have ingresses or services natively, so we generate them from tags.

    the syntax is `kr.ingress.{container-port}=https://{domain}/{path}`

    to use a subdomain of your default assigned ingress domain, use sub.* , i.e.

    ```sh
    docker run -ti --label kr.ingress.80='https://nginx.*' nginx
    ```

    will make your container available at https://nginx.123123.1d.pt

=== "kubectl"

    you can use the same labels as with the docker api to autogenerate routes.
    however, using k8s objects directly allows for more fine grained control.


    let's start with launching a pod and service

    ```yaml title="example.yaml"
    ---
    apiVersion: v1
    kind: Image
    metadata:
      name: hashicorp-http-echo
    spec:
      ref: hashicorp/http-echo
    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name: echo1
      labels:
        app:  echo
        text: hello
    spec:
      containers:
      - name:   echo
        image:  hashicorp-http-echo
        args: ["-text=\"hello from pod1\""]
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: echo
    spec:
      selector:
        app: echo
      ports:
        - protocol:   TCP
          port:       80
          targetPort: 5678
    ---
    ```
    ```bash
    kubectl apply -f example.yaml
    ```


    then edit the default ingress to route a new host to the created service


    ```
    kubectl edit ingress default
    ```

    ``` {.yaml title="ingress.yaml" hl_lines="8 10"}
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: default
    spec:
      tls:
        - hosts:
          - echo.123123.1d.pt
      rules:
      - host: echo.123123.1d.pt
        http:
          paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: echo
                port:
                  number: 80
    ```

=== "compose"

    docker does not have ingresses or services natively, so we generate them from tags.

    the syntax is `kr.ingress.{container-port}=https://{domain}/{path}`

    to use a subdomain of your default assigned ingress domain, use sub.* , i.e.

    ```yaml title="docker-compose.yaml"
    version: "3.9"
    services:
      nginx:
        labels:
          kr.ingress.80: https://nginx.*
        image: "nginx"
    ```
    
    ```bash
    docker compose up
    ```

=== "swarm"

    docker does not have ingresses or services natively, so we generate them from tags.

    the syntax is `kr.ingress.{container-port}=https://{domain}/{path}`

    to use a subdomain of your default assigned ingress domain, use sub.* , i.e.

    ```yaml title="docker-compose.yaml"
    version: "3.9"
    services:
      nginx:
        labels:
          kr.ingress.80: https://nginx.*
        image: "nginx"
    ```
    
    ```bash
    docker stack deploy -c ./docker-compose.yaml mystack
    docker stack ls
    ```

## using your own custom domain

A domain must be bound to an ingress before it is routed and it can only be bound to one ingress. To bind a domain, put it into a tls field in ingress.

=== "kubectl"

    ```
    kubectl edit ingress default
    ```

    ```{.yaml title="ingress.yaml" hl_lines="8"}
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: default
    spec:
      tls:
        - hosts:
          - web.example.com
    ```

then add a CNAME record "web" to your "example.com" domain
with the content being your ingress address, in this example "123123.1d.pt."

depending on your DNS provider, if you want to use the bare "example.com" on your ingress, you might have to use an ALIAS record.

!!! info
    there may be a significant delay between adding the domain and it being available in routing. we first have to verify the cname was set correctly before routing traffic to avoid domain takeover attacks.

## using a custom wildcard domain

adding a wildcard domain such as "*.example.com" allows routing in kraud ingress based on any subdomain of that wildcard without having to set a cname each time.

=== "kubectl"

    ```
    kubectl edit ingress default
    ```

    ```{.yaml title="ingress.yaml" hl_lines="8"}
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: default
    spec:
      tls:
        - hosts:
          - *.example.com
    ```

    a host rule may then pick any subdomain
    ```yaml
    rules:
    - host: echo.example.com
      http:
    ```
