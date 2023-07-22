### 1. Lunix files system

#### 1.1 architecture overview

```yaml
/
├── bin : Essential user binaries (executable programs)
├── boot : Bootloader files and kernel
├── dev : Device files (representing hardware devices)
├── etc : System configuration files (editibale text config like resolv.cofig for dns rtc..)
├── home : User home directories
├── lib : Shared libraries and kernel modules
├── media : Mount point for removable media (e.g., USB drives)
├── mnt : Mount point for temporary file systems
├── opt : Optional software packages
├── proc : Virtual file system for process information
├── root : Home directory for the root user
├── run : Runtime files (e.g., process-specific and temporary files)
├── sbin : System binaries (executable programs for system administration)
├── srv : Data for services provided by the system
├── sys : Virtual file system for kernel-related information
├── tmp : Temporary files
├── usr : User-related programs and data
│ ├── bin : User executables
│ ├── include : Header files for C/C++ libraries
│ ├── lib : Libraries for user programs
│ ├── local : Locally installed software
│ ├── sbin : System administration executables
│ └── share : Architecture-independent data files
└── var : Variable data (e.g., logs, databases, spool files)
├── cache : Cache files
├── lib : Variable state information
├── log : Log files
└── spool : Spool directories (e.g., for printing and mail)

```

#### 1.2 navigating

```bash
pwd          # print current path to see where we are
ls           # list file and folder in the current path
ls /bin      # list with absolute path
ls -1        # list line by line
ls -l        # long listing, includes details about files like size etc..
ls -a        # show hidden files too
cd bin       # change working directory to the bin folder (bin should exist on the current path)
cd /bin      # change working directory  with absolute path
cd ..        # navigate back back one step
cd ~         # go the current user home directory (need to be loged in as a user not root)
```

#### 1.3 creation & deletion

```bash
mkdir test      # makes a new dir named test
mv test app     # rename test to app
touch index.js  # create a file touch file1 file2 …
rm index.js     # (remove a file) rm file1 file2 / rm _.js / rm file_

rm app         # wont work, dir may contains files
rm -r app      # remove folder an its files recursively

du -hs app     # see the size on the folder
```

#### 1.4 calculate size

While the ls command provides information about files and directories, it doesn't directly give you the size or disk usage of each file or directory. The primary purpose of ls is to list the contents of a directory.

we can use ls just to see a size of a single file.

On the other hand, the du command is specifically designed to estimate the disk usage of files and directories. It recursively calculates the total size occupied by files and directories, including subdirectories. This makes du particularly useful when you want to determine the space consumed by specific files or directories on your disk.

```bash
du -hs <folder_name>
du -hs
```

- The `-h` option is used to display the size in a human-readable format (e.g., 1.5M, 2.3G).
- The `-s` option is used to provide a summary of the disk usage, without listing the sizes of individual files.

#### 1.5 working with files

```bash
nano index.js     # intercat with the terminal to make changes in the file content
crtl x            # exits and save

cat index.js              # see the content of the file
cat file1 > file          # copy the content from a file to another
cat file1 file2 > file3
cat file.txt | pbcopy     # copy the outputed cotent on the buffer

echo "hello"                # will print hello on the terminal
echo "hello" > file.txt     # copy the content from a file to another
echo "hello" >> file.txt    # will add hello on top of the old file content

# Example: lets print the output of ls -l that shows details about a dir in a file
ls -l /etc > data.txt
cat data.txt # will contains data that is return by ls -l /etc
```

for cat and echo with > , if file does not exits it will create it
for cat if we used the name of a file that dos not exits it will crate it
note echo "hello" is the same as echo hello

```bash
>   # append
>>  # overwrite
```

**note:** `|` is used for command chaiaings! see part 3

#### 1.6 File permissions

`.sh` are file that can include any lunix commands (read more)

```sh
echo echo hello > deploy.sh
ls -l                         #to see permission
```

output example:

```bash
-rwxr-xr-x  1 root root 49258496 Jun 16 10:48 kubectl
drwxrwxrwx 11 anas anas     4096 Jun 18 18:45 projects
-rwxrwxrwx  1 anas anas      333 Jun 16 09:05 deploy.sh
drwx------  4 anas anas     4096 Jun 16 10:30 snap
```

- this that start with `d` means directory
- things that starts with `–` means file

```bash
chmod u+x deploy.sh        #add execute permission to the user (u)
```

#### 1.7 searching for text in files

```bash
grep -i root /etc/passwd # Search for the word "root" in the passwd file
```

`-i` to enable sensitive case means it will look for root or Root or ROOT etc..

Unlike ls, it lists files and directories recursively in the current directory

```yaml
find -type d                # List only directories The search starts from the current path
find -type f                # List only files
find -type f -name "f*"     # List files with names starting with "f"
find -type f -iname "F*"    # List files with names starting with "F" or "f" (case-sensitive)

find / -type f -name "*.js"    # Print the paths of JavaScript files in the entire system to data.txt. The search starts from the root directory ("/").
find / -type f -name "*.js" > output.txt #we can always save the output to a file
```

note using grep -i root is the same as grep -i "root" the sane goes for echo, both commands will yield the same result

- -i to enable sensitive case means it will look for root or Root or ROOT etc..

note we can have more dynamicsearch like rgex, for that just ask something like AI

#### 1.8 Compess files using Tar

```bash
Put the projects files in a single file
tar czf my_file_name.tar.gz
c: compare
z: zip
f:file
```

- Now on the remote server bash use xf (extract folder) and put it on a folder

#### 1.9 copying between machines

`scp` is used to securely transfer files between a local host and a remote server or between two remote servers.

It uses the `SSH` (see part 6) protocol for authentication and data encryption, providing a secure method for file transfers.

- to send a local file to the remote server\_

```bash
scp file.txt remote_username@10.10.0.2:/home/remote_username
scp file.txt remote_username@10.10.0.2:~
```

`~` will automatically return the current user directory, if if we are loged in on the local device as john, `~` will refers to `/hone/john`

- to get a file from remote server to local:

```bash
scp remote_username@10.10.0.2:/remote_path /local_path
```

please **note** that to copy a folder instead if file we should add the flag -r for recursive

```bash
scp -r remote_username@10.10.0.2:/remote_path /local_path
```

---

### 2. SH AND BASH

#### 2.1 Introduction

Bash and sh are both shells commonly used in Unix-like operating systems. While they have similarities, there are differences to consider:

Bash, or Bourne Again SHell, is a feature-rich shell known for its advanced capabilities. It offers command-line editing, history expansion, scripting support, and various built-in commands and utilities. It provides a more interactive and user-friendly experience, making it popular as the default shell for user accounts on many systems.

Sh, or the Bourne Shell, is a simpler and more minimalistic shell that aims to adhere closely to the POSIX shell standard. It is designed to be lightweight and efficient, making it suitable for resource-constrained systems or situations where speed is a priority. /bin/sh is often a symbolic link to the default shell (such as Bash or another compatible shell).

Bash is highly compatible with sh and can run most scripts written for sh without issues. However, scripts written specifically for Bash may not work correctly in sh due to the absence of certain Bash-specific features. It's generally recommended to write scripts in a way that follows POSIX standards to ensure compatibility across different shells and platforms

BASH ITS SELF IS A RUNNING PROCESS INSIDE THE LUNIX SYSTEM TAKE TAKE COMMANDS AND SEND THEM TO THE KARNEL FOR EXECUTION ( SEE PART 9 MANANGING PROCESSES)

#### 2.2 Chaninag commands

```bash
Mkdir test; cd test ; echo cool (will run other command even if mkfir test failed)

Mkdir test && cd test && echo cool (wont keep exucution if one failed)

Command1 || command2 (or operator)
```

---

### 3. SSH: secure Shell

on the new device or OS, use

```bash
ssh-keygen
```

they will ask u to enter a password for it so now one can push to git for example using ur ssh

go to ~/.ssh/id_rsa.pub and copy the key

now we can copy prive our public key to any remote service like github or cloud machine to connect or login to it! After that we can run

```bash
ssh -T git@github.com to make sure we are loged in
```

---

### 4. Envirment variable and configs In lunix

```bash
Printenv (list all env variable in our machine)
Printenv key (see the value of a specific env variable)
Or
echo $key ($ tell lunix to refers to an env variable )
```

Export db_user=anas (set a env variable) but its session avaible only ,The variable will be available to the current shell session and any child processes spawned from it., if we open another termonall it wont be them or if we close and open the current terminal

To make it perssistance

```bash
cd ~                                    # go to the user home dir
echo export db_user=anas >> .bashrc     # append the env to the bashrc file
echo export db_user=anas >> ~/.bashrc   # if we are on another path
source ~/.bashrc                        # reload the contents of the .bashrc file into the current shell session
```

when we add something to the .bashrc, we can see the effect only on the next terminal session. The command `source ~/.bashrc` ensures that the changes take effect immediately without needing to restart the shell

The .bashrc file is a script file in Unix-like systems that is executed when you start a new interactive Bash shell session. It allows you to customize the behavior and environment of the Bash shell by defining aliases, setting environment variables, configuring the prompt appearance, and creating shell functions. It helps personalize and enhance your command-line experience

there is a bashrc file for each user folder
cat ~/.bashrc

### 5. PROCESSES

A precess is an instance of running program, to see all running process:

#### 5.1 List porcessess

```bash
ps
```

output:

```yaml
| PID  | TTY    | TIME       | CMD  |
| ---- | ------ | ---------- | ---- |
| 598  | pts/0  | 00:00:00   | bash |
| 2426 | pts/0  | 00:00:00   | ps   |
```

- `PID` if a unique program id

- `Pts/0` main the progtam is running of first terminal, if we oprned a new terminal and node index you will see that node server tty is pts/1

- `bash` born agin shell is the program that takes own commands and send them to lunix for exucuation

#### 5.2 kill a process

If we have a running process like a rails sever for example we can kill it like so :

```bash
Kill rails_pid
Kill -9 rails_pid
```

`-9` or `--signal=9`: is used to forcefully immediately terminate a process without allowing it to perform any cleanup or handle the signal

Remember, you need appropriate permissions to kill a process. If you're not the owner of the process or don't have sufficient privileges, you may need to run the kill command as the superuser (root) using sudo.

### 6. Managinger users

Useradd xx /to add user
usermod
userdel

Write useradd and press enter to see all option

```bash
useradd -m john   # The -m option creates the user's home directory
cat /etc/passwd
```

output:

```sh
john:x:1001:1001:John Doe:/home/john:/bin/bash
```

- `john` is the user unique name
- `x` is the password. Historically, the password was stored in this field, but modern systems store an `x` or `\*` indicating that the password is stored in the `/etc/shadow` file or another authentication mechanism.
- first `1001` is the user ID (UID): A unique numerical identifier assigned to the user.
- second `1001` is the group ID (GID): The numerical identifier of the primary group associated with the user.
- `John Doe` Additional information about the user, such as their full name, is usually empty.
- `/home/john` The path to the user's home directory.
- `/bin/bash` The default shell for the user, which determines the command interpreter they use when logging in.

**note:** `cd ~ `is euqivent to `cd /home/john`, because after login `~` refer to the loged in user home directory

but we also have sh, we can use usermod to modify it

```sh
usermod -s /bin/sh john
```

### 7. Managing groups

#### 7.1 overview

Group help use to give a users of the same a group the same permissions

```sh
groupadd developers          # add a group
cat /etc/group               # list all the groups
```

output:

```sh
developers:x:1001:
```

In this example, the line represents the "developers" group, with the group ID (GID) set to 1001. There are no group members listed in this case.

```bash
usermod -aG developers john
cat /etc/group

```

output:

```sh
developers:x:1001:
```

- `-G` replaces the current supplementary groups of the user with the specified group(s).

- `-aG` appends the specified group(s) to the user's existing supplementary groups. It ensures that the user remains a member of their primary group while being added to the specified group(s).

In Linux, each user account has a primary group and can belong to one or more secondary groups. Here's an explanation of primary and secondary groups:

#### 7.2 Primary Group

Every user account is associated with a primary group.

- The primary group is specified at the time of user creation and is stored in the `/etc/passwd` file.
- The primary group typically shares the same name as the user's username.
- The primary group is used as the default group for file and directory ownership when the user creates new files or directories.
- By default, a user has read and write permissions to files owned by their primary group.

#### 7.3 Secondary groups

A user can belong to one or more secondary groups. Secondary groups are additional groups to which the user has membership apart from their primary group.

- Secondary groups are the groups we create manually, and mentioned before they are defined in the `/etc/group` file.
- Membership in secondary groups allows the user to access files and directories owned by those groups and utilize group-specific permissions

#### 7.4 list user groups

```sh
groups john              # to see his secondary groups
grep john /etc/passwd   # john primary group
```

### 8. ubuntu 20.04 & LUNIX OS

what is it? there is ubuntu too
its uses apt , but we can always use curl! ask if curl is built it by default

In ubuntu we have apt (advance package tool)
Apt update (update the package db)
apt install nano (install text editor for lunix)
Nano (to open nano)
ctrl s (exit)
Ctrl l (clear cmd)
Apt remove nano (to delete a package)

**there is also curl**
Any way intalling depenscies depends from an operating system to another
most of the time u may use curl, what is it
curl is a http tool to get or post data from the internet

- `--silent` : we don’t want logs in the console
- `--location` : allow http redirect
  The url contain a bash script

#### 8.1 install node

```bash
#To Install NVM on Ubuntu 20.04
https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04

sudo npm install -g yarn
```

#### 8.2 install docker

```bash
sudo apt update
sudo apt install docker.io docker-compose -y

sudo systemctl start docker
sudo systemctl enable docker

#  it is possible to add wsl integration on windows
```

#### 8.3 install git

git might be already installed by default, check it by using `git --version`

```bash
sudo apt-get install git
sudo apt-get upgrade
```

#### 8.4 install ruby on rails

```bash
# installiong ruby and its version manager and rails
https://www.digitalocean.com/community/tutorials/how-to-install-ruby-on-rails-with-rbenv-on-ubuntu-22-04

# after installing ruby and rails, go to your rails_project folder and run
bundle install
yarn install
sudo chmod -R 777 .    #just give permission to any file to prevent any issues

# install some important binaries for pdfkit and activeStorage
sudo apt install libpq-dev
sudo apt install wkhtmltopdf
sudo apt-get install libvips

# set up rubocop (SKIP --> it seems like its set up by default)
1 --> install robocop exetntion for vscode
2 --> which robocop # get the exucutable path
3 --> go to vscode > settings > search for rubocop > pick remote wsl tab
4 --> apply these configs
      - field: Ruby › Rubocop: Config File Path
      - value: /home/anas/pr/api/.rubocop.yml
      - field: Ruby › Rubocop: Execute Path
      - value: /home/anas/.rbenv/shims/
```

after cloning the api
bundle install is impotant-

When it comes to installing the Ruby on Rails framework, there are two main approaches:
globally
Adding Rails to a project's Gemfile:

--

wsl configuration

install vscode and install the wsl extention

//u dont need anything from above , jus this one line is enough
netsh interface portproxy add v4tov4 listenport=3003 listenaddress=0.0.0.0 connectport=3003 connectaddress=172.20.205.100

172.20.205.100 is ubuntu eth0 ip / use ip config
get ur local ip v4 of the host and connect to it using lan now

//to eas use it with ssl, just use ngrok

33333333

```

```

history display the history oof any command u whote
