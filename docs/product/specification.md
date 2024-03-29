

# Product Specifications


Kraud is a Platform as a Service (PaaS) with a broad set of features and compatibility layers.

## Product Readyness

| Feature                   | SLA | Redundancy  | Security Barriers  | Readyness  |
|---------------------------|-----|-------------|-----------|-----------------------|
| __compute__ ||||
| Managed Containers    | [90%](../sla) | :material-check:{ .green }  N+2 in 1 Zone      | microvm+vpc | Usable |
| Managed Kubernetes    | no  | :material-check:{ .green }  N+2 1 Zone      | microvm+vpc | Experimental          |
| Managed Apps          | no  | :material-check:{ .green }  N+2 1 Zone      | microvm+vpc| Experimental          |
| Confidential Compute  | no  | :material-alert:{.red} 1 Node (1) { .annotate } | AMD SEV-SNP | Experimental          |
| __network__ ||||
| Managed Ingress       | no  | :material-check-all:{ .green } 2N+1 in 2 Zones     | isolated machine | Usable |
| Authenticated Ingress | no  | :material-check-all:{ .green } 2N+1 in 2 Zones     | isolated machine | Experimental |
| Direct Ingress        | no  | :material-alert:{.red}  1 Rack (2) | :material-alert:{.red} exposed (3)  | Experimental          |
| __storage__ ||||
| Ephemeral NVME        | no  | :material-alert:{.red} 0 (4)             | ephemeral encryption | Usable |
| LV2 Volumes           | no  | :material-check:{ .green } 3N in 1 Zone  | isolated machine     | Usable |
| NFS Volumes           | [99%](../sla) | :material-check:{ .green } 1+1 in 1+1 Zone | isolated machine     | Experimental |
| LV Volumes            | no  | :material-alert:{.red}  2N on 1 Host (6) | LVM | Usable |

!!! quote ""
    1. Hardware with AMD SEV-SNP is has very limited availability and pods will likely not be rescheduled on failure.
    2. Direct Ingresses are bound to a single zone. Applications using raw internet facing IP addresses must engineer their own load balancing strategy.
    3. Direct exposure to the internet without a fronting kraud ingress requires a carefully setup firewall inside the vm
    4. Local node storage is very fast but ephemeral. It is cleared on container shutdown, restart, reschedule, etc.
    5. Redundancy reduced volumes are intended for archival and large data pools. Loss is unlikely due to double-replication, but customer are adviced to only store data that can be reconstructed by other means.
    6. LV are local nvmes on a vm host that are not replicated outside of the chassis, intended for legacy applications. Customers are advised to build their own backup plan.



## Availability Zones

| Zone           | Datacenter Operator                     | ISO  27001  | Renewable Energy  |
|----------------|-----------------------------------------| ----------- | ----------------- |
| UCA (default)  | [3U Telecom](https://www.3utelecom.de/) | [yes](ISO-27001-Zertifikat-BER.pdf) | [100%](Entwertungsnachweis3UTELECOMGmbHfuer2020.pdf) | 
| YCA            | [Hetzner Online GmbH](https://www.hetzner.com/unternehmen/rechenzentrum/) | [yes](https://www.hetzner.com/assets/downloads/FOX-Certificate.pdf) |[100%](https://www.hetzner.com/de/assets/Uploads/downloads/oekostrom-zertifikat-2022.pdf) |
| LMU            | [LMU Klinikum](https://www.lmu.de/en/) | no | ? |


## Data Security

Tenant resources are isolated from other tenants using [microvms](/technology/architecture/#microvms)

All Volumes are encrypted at rest and protected against physical theft. <br>
Customers with extremly sensitive data may additionally want [encryption at use](/technology/confidential/)

Traffic within customer VPC networks is [encrypted with wireguard](/technology/vpc/#encrypted-everything) even within the same physical rack, 
to protect against sideband attacks and network intrusion.

All external traffic arriving at a [managed ingress](/quickstart/ingress/) is load balanced, authentication and filtered before entering a VPC. Customers who prefer [raw ingresses](/quickstart/ingress/#raw-tcp-ingress) will have to apply their own protection,
such as firewall rules inside the vm itself.
