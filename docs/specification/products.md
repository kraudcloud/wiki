

# Product Specifications


Kraud is a Platform as a Service (PaaS) with a broad set of features and compatibility layers.

## Product Readyness

| Feature                   | SLA | Redundancy  | Security Barriers  | Readyness  |
|---------------------------|-----|-------------|-----------|-----------------------|
| __compute__ ||||
| Managed Docker        | no  | :material-check:{ .green }  N+2 in 1 Zone      | microvm+vpc | Usable |
| Managed Kubernetes    | no  | :material-check:{ .green }  N+2 1 Zone      | microvm+vpc | Experimental          |
| Managed Apps          | no  | :material-check:{ .green }  N+2 1 Zone      | microvm+vpc| Experimental          |
| Confidential Compute  | no  | :material-alert:{.red} 1 Node (1) { .annotate } | AMD SEV-SNP | Experimental          |
| __network__ ||||
| Managed Ingress       | no  | :material-check-all:{ .green } 2N+1 in 2 Zones     | isolated machine | Usable |
| Authenticated Ingress | no  | :material-check-all:{ .green } 2N+1 in 2 Zones     | isolated machine | Experimental |
| Direct Ingress        | no  | :material-alert:{.red}  1 Rack (2) | :material-alert:{.red} exposed (3)  | Experimental          |
| __storage__ ||||
| Ephemeral NVME        | no  | :material-alert:{.red} 0 (4)             | ephemeral encryption | Usable |
| Block Volumes         | no  | :material-check:{ .green } 3N in 1 Zone  | isolated machine     | Usable |
| GFS Volumes           | no  | :material-check:{ .green } 3N in 1 Zone  | isolated machine     | Experimental |
| Red Volumes           | no  | :material-alert:{.red}  2N in 1 Zone (5) | isolated machine     | Experimental |

!!! quote ""
    1. Hardware with AMD SEV-SNP is has very limited availability and pods will likely not be rescheduled on failure.
    2. Direct Ingresses are bound to a single zone. Applications using raw internet facing IP addresses must engineer their own load balancing strategy.
    3. Direct exposure to the internet without a fronting kraud ingress requires a carefully setup firewall inside the vm
    4. Local node storage is very fast but ephemeral. It is cleared on container shutdown, restart, reschedule, etc.
    5. Redundancy reduced volumes are intended for archival and large data pools. Loss is unlikely due to double-replication, but customer are adviced to only store data that can be reconstructed by other means.



## Datacenter, Physical Security


Kraud is physically located in the colo datacenter FSN1-DC2 [Hetzner Online GmbH](https://www.hetzner.com/unternehmen/rechenzentrum/)

 - [Technische und organisatorische Maßnahmen nach Art. 32 DS-GVO](TOM.pdf)
 - [ISO27001 Certification](https://www.hetzner.com/assets/downloads/FOX-Certificate.pdf)
 - [100% renewable energy cert](https://www.hetzner.com/de/assets/Uploads/downloads/oekostrom-zertifikat-2022.pdf)

Access is documented with logs of name, timestamp and surveillance camera snapshot.


## Security Architecture

Tenant resources are isolated from other tenants using [microvms](/technology/architecture/#microvms)
Additionally customers with extremly sensitive data may choose to protect against CPU bugs with [confidential vms](/technology/confidential/)

Traffic within customer VPC networks is [encrypted with wireguard](/technology/vpc/#encrypted-everything) even within the same physical rack, 
to protect against sideband attacks and network intrusion.

All external traffic arriving at a [managed ingress](/quickstart/ingress/) is load balanced, authentication and filtered before entering a VPC. Customers who prefer [raw ingresses](/quickstart/ingress/#raw-tcp-ingress) will have to apply their own protection,
such as firewall rules inside the vm itself.

Data at rest is separated from customer vms and accessible only to the hypervisor.





