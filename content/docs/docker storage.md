## types of docker volume
### host volume
- bind mount (host files)
- filesystem is under control of *host*
### docker volume
- in Docker Area managed by Docker
- anonymous volume `-v /containerPath`
- named volume `docker volume create newVolume`
- tmpfs mount → temporary → container memory 
```cmd
docker volume --help
# to manage named volumes
```
