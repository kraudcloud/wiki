---
date: 2023-10-19
authors: [aep]
categories:
 - product
---

# Full Kubernetes is now generally available


## get your very own real k8s for free with kraud.cloud

Good news, kubernetes is now available for everyone.
[k8s app](https://kraudcloud.com/marketplace/?search=kubernetes)

There's a free tier version with a single node and v6 addresses, as well as a version that has 3 nodes
and uses v4 addresses. As you probably know, v4 addresses are rare so they're not available in free tier.

Deploying k8s on top of kraud enables you access to the full original k8s experience, including the ability to install CNI plugins and custom resource definitions.


You can also download and change the [compose spec](https://github.com/kraudcloud/apps/blob/main/k8s/docker-compose.yaml) and launch k8s with [kra](https://github.com/kraudcloud/cli)

## kubectl and compose are incompatible use cases

Thanks to the helpful feedback of our users we have learned that the original idea of emulating the k8s control plane is not the experience you're looking for. 

The kraud k8s control plane is not fully compatible with the k8s ecosystem, and will always lack behind k8s upstream.
With the availability of real k8s as app, we have decided to completely stop working on kubectl compatibility for the kraud control plane. kubectl may function for a while until we completely remove the api.

We will instead further enhance docker compose compat. For example just recently we introduced the ability to use overlay networks, which k8s does not support.

Going forward there are 4 ways to use kraud:

 1. launch or publish a complete app on the marketplace
 2. launch k8s from the marketplace and work with the k8s ecosystem
 3. launch your own app on managed docker compose clusters with [kra](https://github.com/kraudcloud/cli)
 4. launch a bare linux VM and use legacy tooling

as always we love your feedback and wish you an efficient computing experience.
