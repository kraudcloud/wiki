# Routing Incoming HTTPS Connections

Pods are not directly exposed to the internet by default. Instead they are connected to each other using a [wireguard](https://www.wireguard.com/) mesh network we call the vpc.

If you're familiar with docker networks or kubernetes, this will feel natural. The network is managed for you by the kraud control plane but does **not** intersect with other tenants networks. You cannot directly access a pod in a different account without going through a gateway.

Similarly you cannot directly acess pods from the internet. Instead we manage an ingress controller that routes traffics to your pods based on rules such as hostname and path or raw tcp port.

## discovering your ingress

your cluster comes with a default ingress and domain managed by kraud.

=== "kra"

    to find your ingress domain use

    ```sh
    kra in ig
    ```

    as long form example:

    ```sh
    $ kra inflow ingress
    id                                    domain           
    0822f56e-f813-42c5-8588-98036ae3f895  foo.1d.pt
    ```

    or as json
    ```sh
    kra in ig -o json
    ```

## routing your first service

=== "kra"

    docker compose does not have ingresses or services natively, so we generate them from tags.

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
    kra up
    ```


=== "docker"

    docker does not have ingresses or services natively, so we generate them from tags.

    the syntax is `kr.ingress.{container-port}=https://{domain}/{path}`

    to use a subdomain of your default assigned ingress domain, use sub.* , i.e.

    ```sh
    docker run -ti --label kr.ingress.80='https://nginx.*' nginx
    ```

    will make your container available at https://nginx.123123.1d.pt


## using your own custom domain

A domain must be bound to an ingress before it is routed and it can only be bound to one ingress.

=== "kra"

    To bind add your own domain, use:

    ```
    kra domain add web.example.com
    ```


then add a CNAME record "web" to your "example.com" domain
with the content being your ingress address, in this example "123123.1d.pt."

depending on your DNS provider, if you want to use the bare "example.com" on your ingress, you might have to use an ALIAS record.

!!! info
    there may be a significant delay between adding the domain and it being available in routing. we first have to verify the cname was set correctly before routing traffic to avoid domain takeover attacks.

## using a custom wildcard domain

adding a wildcard domain such as "*.example.com" allows routing in kraud ingress based on any subdomain of that wildcard without having to set a cname each time.

=== "kra"

    ```
    kra domain add '*.example.com'
    ```

    a host may then pick any subdomain

