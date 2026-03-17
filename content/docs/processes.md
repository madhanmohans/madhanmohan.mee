---
Created Time: 
tags: 
Parent: "[[Design and Engineering of Computer Systems]]"
---
* Processes and its states
  * Running - process is in the CPU
  * Ready - process is ready to be run on the CPU
  * Blocked - process is blocked due to some fetch calls 

> Interrupt signals the cpu that a once blocked process is ready and switches the context after some time.

* PCB - Process Control Block(a data structure) has all the information regarding a process 

  * PID
  * Process State 
  * Pointers to other processes (parent and child)
  * Process context saved in memory when it is not running
  * Information related to where it is stored in memory and ongoing I/O communications

* Process management System Calls

  * Fork - forks a ***parent*** process to a ***child*** process (copies parent -> child)

  * Exec - rewrites the ***parent*** process with its own memory image and instructions

  * Exit - Child processes stops executing and becomes ***zombies***

  * Wait - ***Reaps(cleans the memory)*** of the child processes(zombies)

  * > Sometimes the parents exit before the child and they become orphan processses which is when foster parent(***generally init***) will adapt them and reap them, if not reaped, exhausts system memory

> OS Scheduler loops over ***ready*** processes.
## ==*Processes ==


---
## ==*References ==

