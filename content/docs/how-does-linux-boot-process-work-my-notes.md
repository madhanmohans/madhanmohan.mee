#toPublish 
- BIOS or UEFI firmware gets the main parts of the computer ready for action.
- BIOS is tied to the Master Boot Record (MBR) system, while UEFI uses the GUID Partition Table (GPT), offering more flexibility and better security.
- BIOS has slower boot time and less secure boot, while UEFI has faster boot time and secure boot.
- The boot loader software is responsible for locating the operating system kernel, loading it into memory, and starting its execution.
- Common boot loaders include LILO and GRUB2, with GRUB2 being the most widely used today.
- The Linux kernel takes over the computer's resources and starts initiating all the background processes and services.
- Systemd is the modern init system that handles many responsibilities to get the system booted and ready to use, such as mounting file systems, starting services, and loading the desktop environment.