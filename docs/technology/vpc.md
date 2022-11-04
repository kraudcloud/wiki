The connections between your pods (containers) are expected to be private, and not over the internet. You wouldn't want your sql database on the internet.

Although some people apparantly [don't care, or don't understand](https://www.shodan.io/search?query=mysql).


So alomst all cloud providers offer Virtual Private Networks of some sort. We'd call them "VPN", but people tend to think these are like for Netflix, so we call them VPC. Is there a technical different, really?

Depends!


Since a VPC is not intended to leave a cloud providers internal network, it is often implemented as tag on their network. In the simplest case as [vxlan](https://en.wikipedia.org/wiki/Virtual_Extensible_LAN). Vxlan is not secure, but you would expect a professional cloud provider put in a little bit more effort than that. Some don't and expect their customers to do it. Sometimes that fact [is just a footnote](https://docs.hetzner.com/cloud/networks/faq/)

## encrypted everything

At Kraud we enable self hosting first class, so of course the vpc is also designed in a way that is safe even when you don't have a mean looking security guard at home. Starting with the assumption that every cable is compromised, and must not carry unencrypted traffic. That includes the cables in our own datacenter.

[Wireguard](https://www.wireguard.com/) is formally verified, and has no issue spanning networks around the entire globe.

So a container at home can connect to "db" just fine, and the traffic will be routed to wherever that db container is running, encrypted with wireguard.

![wg.png](wg.png)


Service discovery inside the VPC is well described by the [kubernetes documentation](https://kubernetes.io/docs/concepts/services-networking/service/). In short, a service name like "db" resolves a virtual ip address which is routed according to where the backend service(s) are actually running dynamically. This has major advantages for avoiding caching issues when a backend service changes, but a frontend service doesn't refetch dns in time.




