- Q: do services and inter-pod networking work<br>
  A: yes, networking is feature complete.

- Q: can i use helm?<br>
  A: yes, but most public charts are broken since RBAC isn't ready.

- Q: can i use portainer?<br>
  A: some features work. we'd love to get feedback from active users.

- Q: can i use lens? <br>
  A: yes

- Q: do sidecars work?<br>
  A: well enough. we'll need user feedback before covering more use cases. 

- Q: does persistence work?<br>
  A: yes, but only ReadWriteOnce is available so far

- Q: does ingress work?<br>
  A: yes, ingress is feature complete

- Q: can i use any container image?<br>
  A: yes, copy images to the cloud using "docker save myimage | docker -c kraud.user load"

### kubernetes / kubectl objects


| resource name          | stage       | documentation  |
|------------------------|-------------|----------------|
| Pod                    |  available  | [wiki/pods](https://github.com/kraudcloud/wiki/wiki/pods)  |
| Image                  |  available  | [wiki/images](https://github.com/kraudcloud/wiki/wiki/images)  |
| Ingress                |  available  | [wiki/ingress](https://github.com/kraudcloud/wiki/wiki/ingress)  |
| Service                |  available  |   |
| PersistentVolumeClaim  |  available  |   [wiki/volumes](https://github.com/kraudcloud/wiki/wiki/volumes) |
| Volume                 |  available  |   [wiki/volumes](https://github.com/kraudcloud/wiki/wiki/volumes) |
| Deployment             |  available  |    |
| Secrets                |  available  |    |
| Namespaces             |  available  |    |
| ConfigMap              |  available  |    |
| ReplicaSet             |  evaluating |    | 
| CronJob                |  evaluating |    | 


