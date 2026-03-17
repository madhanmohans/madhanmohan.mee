### Challenges with VM  
- Managing Guest Operating Systems

> Using Linux kernels, container = Isolated Process (Control Groups + Namespace)
### Control Groups
allows limitation and prioritisation of the use of resources. controls what you can use.
### Namespace
unique identifier given to each process, like URLs. controls what you can see. 

Hypervisor —> Container Engine (LXC)

Container = code + runtime (execution environment)

> Analogy: Docker Image (Class) —> Container (Object)
> 
> We can create multiple containers from a same docker image


> [!important]  
> Try to have only one process in a container  
Daemon → background process will listen and manages request

