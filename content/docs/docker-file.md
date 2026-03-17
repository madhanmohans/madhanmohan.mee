alpine → linux image without dependency
- Text document → commands → to create image out of it
```Java
FROM openjdk:alpine 
// Image to build from (if not from local, from Docker Hub)
// We can use scratch to start from scratch, 
// but we a base pre-built image build on top of it
WORKDIR /usr/app/src 
// create and change directory inside image
[ADD/COPY] /src/path/from/host /dest/path/to/image 
// copy file(s) from host to image
// to add SpringBoot files, JRE, etc from host to image
// Add can also add from remote repository
ENV key value
// pass env variables to image
RUN apt-get install python3 git
// commands supported by the image
// execute command(s) as new layer, used to install softwares
EXPOSE 8080 9009
// for documentation purpose
[CMD/ENTRYPOINT] ["executables", "param", ...]
// configures a container that runs as an executable, main process start
```

> [!info] Docker Hub Container Image Library | App Containerization  
> Introducing Docker Build Cloud: A new solution to speed up build times and improve developer productivity  
> [http://hub.docker.com](http://hub.docker.com)  
```Java
docker build .
// . is the context (DockerFile)
```
## Layers
- Each command will create a new layer with a new image ID, parent ID
- Each layer will be cached, and the changes in the docker file will be rebuild
- Breakup build into reusable layers to leverage caching during build
- Reduce the image size as small as possible
- Do not add unwanted files to image
- Use multi-stage build whenever possible

> [!info] GitHub - gnana-ganesh-tw/node-dockerfile-exercise  
> Contribute to gnana-ganesh-tw/node-dockerfile-exercise development by creating an account on GitHub.  
> [https://github.com/gnana-ganesh-tw/node-dockerfile-exercise](https://github.com/gnana-ganesh-tw/node-dockerfile-exercise)  

> [!important]  
> If you want hints you can checkout to the hints branchgit checkout hints


![[Screenshot_2024-06-21_at_12.32.53_PM.png]]