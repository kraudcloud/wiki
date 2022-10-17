

# Quickstart

kraud supports most familiar devop tools, emulating both the docker and kubernetes api at the same time.
Pick your prefered tool to get started with

- [using docker cli](#docker-cli)
- [using kubectl](#kubectl)


## docker cli

install the official docker cli from [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

An authentication package will be provided to you to access the control plane.

most docker commands work on kraud, but the docker cli is somewhat limited.
Docker contexts allow switching between your local docker service and kraud cloud.

You can use docker context use to quickly switch between contexts.
for other methods, [see the official docs](https://docs.docker.com/engine/context/working-with-contexts/#use-a-different-context)

```bash
docker context use kraud.user #use kraud
docker info # get kraud api version
docker context use default #switch back to local docker
```

due to limitations with dockers attach api, every docker run command must use the -ti flags

```
docker --context kraud.user run -ti ubuntu
```

## kubectl

kraud supports kubectl from the official kubernetes tools
[https://kubernetes.io/docs/tasks/tools/](https://kubernetes.io/docs/tasks/tools/)

An authentication package will be provided to you to access the control plane.

Helm doesn't really work yet, so deployment will involve writing kubernetes objects manually, usually in yaml.


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
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: echo
spec:
  tls:
    - hosts:
      - echo2.example.0x.pt
  rules:
  - host: echo2.example.0x.pt
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

```bash
kubectl apply -f example.yaml
```
