

# Availability


Kraud is new and young but we're slowly approaching production readyness

## Terms


For paying customers only, we guarantee a minimum availability for some products as defined below.
Kraud is not legaly liable for any damages that you suffer from non performance of these guarantees,
but you will be refundend for the entire month in which the non performance occurred.

This is industry standard, we just didnt hire a lawyer yet to write it into more words.

### NFS Volumes


NFS volumes are carefree. They are built with an active/passive system with 99% uptime on top of a mirrored ZFS array.
Snapshots are automatically created daily, weekly and monthly.


| Incident        | Mitigation |
| -------         | ---------- |
| disk failure    | disk will be replaced without data loss |
| node failure    | passive node becomes active automatically |
| accidental file delete by customer | cuustomer may roll back to one of the snapshots |
| software bug    | recovery from magnetic backup in same zone |
| building fire   | recovery from magnetic backups in second zone |

### Managed Containers

Containers are intended to be carefree as well, but we're not quite there yet.
Infrastructure is in place but it sometimes has hickups as we're developing it.

| Incident        | Mitigation |
| -------         | ---------- |
| node failure    | container is automatically rescheduled on other node (except if attached to LV2) |
| zone failure    | customer must use replicated containers in multiple AZs |
