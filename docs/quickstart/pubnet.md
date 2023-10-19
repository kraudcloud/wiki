# Public Layer3 IP Routing

Pods can optionally be exposed directly to the internet.
This can make sense for legacy applications in PVMs for example, but any pod works.


## taking down the firewall

every pod has a random public ipv6 address assigned by default, but it is firewalled.
To open it to the public internet, use the label `kr.network.policy=open`


=== "kra"

    ```yaml title="docker-compose.yaml"
    version: "3.9"
    services:
      nginx:
        labels:
          kr.network.policy: open
        image: "nginx"
    ```
    
    ```bash
    kra up
    ```

=== "docker"


    ```sh
    docker run -ti --label kr.network.policy=open nginx
    ```
    

then find the attached ipv6 adress using the inflow view in `kra in`


```sh
kra in
vpc      kind   public                                  target
default  ip     2001:0db8:85a3:0000:0000:8a2e:0370:7334 default.nginx
```


## fixed public ipv4 addresses


customers may optionally pay for an ipv4 block assignment.
ipv4 addresses are rare and expensive so we can unfortunately not assign any to the free tier.

after purchase, check your assignments with.

```
kra vpc show

public networks:
id                                    segment  net
20b42677-29e1-4cfb-8b41-e65ada50c27d  uca      233.252.0.0/24
```

you may then assign a random v4 with `kr.network.public=*` or a specific one with `kr.network.public=233.252.0.2`


=== "kra"

    ```yaml title="docker-compose.yaml"
    version: "3.9"
    services:
      nginx:
        labels:
          kr.network.policy: open
          kr.network.public: 233.252.0.2
        image: "nginx"
    ```
    
    ```bash
    kra up
    ```

=== "docker"


    ```sh
    docker run -ti --label kr.network.policy=open -l kr.network.public=233.252.0.2  nginx
    ```
