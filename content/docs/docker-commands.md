`docker pull`
- used to pull images from docker hub if not already in local
`docker pull nginx:1.19`
- we can mention the directory and tag from which to download the docker image
`docker build -t <imageName>`
- building a docker image from a dockerfile and context
- building with a tag ‘imageName’
`docker run -d -p 80:80 <imageName>`
- create, run & start a new container instance with the specified image
- -d → detached mode
- -p 80:80 → host’s port 80 to container’s port 80

### other commands:
**view containers and images:**
```bash
docker images          # List images
docker ps              # List running containers
docker container ls    # List containers (same as docker ps)
```

**run containers:**
```bash
docker pull nginx                        # Download nginx image
docker run -d nginx                      # Run nginx in detached mode
docker run -d --name nginx-demo nginx    # Run with custom name
```

**stop and remove containers:**
```bash
docker stop nginx-demo    # Stop the container
docker rm nginx-demo      # Remove the container
docker rmi nginx          # Remove the image
```