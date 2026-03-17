<div class="videoWrapper">
<iframe width="600" height="315" src="https://www.youtube.com/embed/LHZhVgtQsO8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

==28/02/2022 22:55==

Parent: [[Design and Engineering of Computer Systems]]
Tags: #decs 

## ==Lecture 10 Virtual machines and containers:==

## [5:06](https://www.youtube.com/watch?v=LHZhVgtQsO8&t=306)

IaaS - Hardware infrastructure is setup and managed by the Cloud Service provider; their own applications are run by the user

PaaS - Hardware infrastructure and software platform are setup and managed by the CSP, on top of which applications can be build by using APIs

SaaS - Hardware infrastructure, software platform and the software application are setup and managed by the CSP. User access the software app.



## [11:22](https://www.youtube.com/watch?v=LHZhVgtQsO8&t=682)

> Virtual Machines Manager(VMM) also known as hypervisor runs on top of underlying hardware (whether it is virtual/bare metal) and multiplexes Virtual Machines to utilise the hardware. 
> 
>- Type 1 Hypervisor: Includes OS functionality
>- Type 2(hosted) Hypervisor: Runs along with Host OS
>

Host OS - OS in hypervisors
Guest OS - OS in virtual machines

## [14:27](https://www.youtube.com/watch?v=LHZhVgtQsO8&t=867)

>Problem: Guest OS has to have complete access to underlying hardware (virtualisation) but it cannot be permitted to do privileges operations(low level privileges: system call, interrupt handling, I/O ops,)
>
>Solution: Trap and Emulate VMM
>
>Every time when Guest OS have to access hardware, it will trap to VMM(hypervisor) and it will emulate the access the hardware on behalf of Guest OS.

## [20:11](https://www.youtube.com/watch?v=LHZhVgtQsO8&t=1211)

Problem: Sometimes Guest OS will run privileged instructions without trapping to VMM.

Solution: Techniques to virtualize:

Paravirtualization:

Guest OS code is rewritten to be virtualizable.(accessing whole hardware)

Full virtualization:

CPU instructions of the Guest OS executable are translated.

Hardware assisted virtualization:

VMX mode- Separate rings are allocated where guest OS is in ring 0, and its user programs in ring 3, along with (regular mode) another ring set where Host Os/VMM is in ring 0.

VMX ring 0(Guest OS) is not powerful as Regular ring 0(Host OS/VMM)

Regular ring 0 will set triggers to VMX mode for (VM exits)exiting into it whenever needed.

## [26:38](https://www.youtube.com/watch?v=LHZhVgtQsO8&t=1598)

Containers(lightweight VM):

- Runs on same OS while isolating some processes, applications, libraries and files. (namespaces)

```ad-example
Docker container which runs single application and its dependencies and files.
```
---
## ==References:==

[Lecture 10: Virtual machines and containers](https://www.youtube.com/watch?v=LHZhVgtQsO8)