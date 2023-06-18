#### SUMMER
- WHY DOCKER
- IMAGE

---

#### INSTALLATION UBUNTU

DOCKER AND DOCKER COMPOSE

 just have another md for insalation in bubtu of all

---

#### USE CASE
Lets say I build an app that need node 14 but all team member has node 16 etc.. they all need to downgrade to test the app, docker solve this problem by creating something like a vurtiualmaciie but more optimized called a container that contain the app its self with all it specific dependencies and technologies needed

---

#### IMAGE

Images are blueprints for creating containers. They specify the container's:
- Runtime environment/parent image (e.g., node with Ubuntu)
- Application code
- Dependencies
- Environment variables
- Commands

You can find all images with a parent layer [here](https://hub.docker.com/search?q=), which is a repository of Docker images. It contains pre-made parent images that can be used as the first layer in our Docker image. 

To pull the Node image, open the terminal and type `docker pull node`.

It is always advised to specify a version, or it will always grab the latest one, which can change and make the environment unstable.

---

#### CONTAINERS VS VM
a container is a process of running an application 
containers run on an isolatedenvironment.

because a container is just a process, it can be stopped and restored easily

A VM on the other hand is an abstraction of a machine (physical hardware) means its less efficient and resources expensive, each VM needs a fully-blown copy of a OS

Containers are lightweight, use the OS of the host, start quicklyand uses resources smartly, they uses just what they need unlike VM that take a part of the host resources.

---
## NODE JS APP EXAMPLE

#### CREATE AN IMAGE

we create an imaje using a `Dockerfile` file (no extention) 
each step on the dockerfile is a **layer**
 
Lets say we have an express app that is listing on port 4000

```
-- api
   |-- app.js
   |-- dockerFile
   |-- package.json
```
 
As known, to run this app, we need 
- os
- nodejs installed
- install node dependencies located on package.js
- run the command node `app.js `

So this is how the dockerFile image should look like
```docker
FROM node:17-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 4000
CMD ["node", "app.js"]
```

Each step on the dockerFile image is called a layer
the docker files steps are ... see pdf
 lets explain these layers:


make these a table

```docker
FROM node:17-alpine
```
`FROM` the parent layer, we specify our container base image. It can be pulled from Docker Hub or our local machine if already downloaded. For example, we can use Alpine, a lightweight Linux distribution (only 39MB).

A base image can consist of just the OS or the OS along with the runtime environment. Alternatively, we can use Alpine as the base layer and manually install Node using a command.


```docker
COPY . .
```
To copy our source code to the image, we use the `COPY` instruction. The first `.` refers to the folder where the Dockerfile is located, and the second `.` represents the root path inside the Docker image. Since we set the working directory (`WORKDIR`) to `/app`, it will be translated to `./app` to avoid conflicts and provide a specific folder to work with.

It's recommended to add a `.dockerignore` file to specify files that should be ignored, such as `node_modules`. cuz this file can be installed on the cotainer instead to reduce build time!

The `ADD` instruction is similar to `COPY` but also allows us to add files from a URL or extract compressed files. For example:


ADD http:image.png .
ADD data.zip .


```docker
RUN npm install
```

The `RUN` instruction executes a shell command during build time, which occurs when the image is being built when using `docker run`.

Be awar that in the dockerfile
RUN apt install python wont work cuz alpine does use apt package manager

```docker
EXPOSE 4000
```

The `EXPOSE` instruction is used to inform users of the Docker image about the ports the container will listen on at runtime. It serves as documentation and doesn't perform any special actions.


```docker
CMD ["node", "app.js"]
```

The `CMD` instruction defines the command that will run when the container starts. Unlike `RUN`, which runs during build time, `CMD` executes during runtime when the image is already built and the container is started using `docker run`.

The `CMD` command can be written in two forms:

- Shell form: `CMD npm start` (runs the command on another shell, `/bin/sh`).
- Exec form: `CMD ["npm", "start"]` (runs the command without spawning another shell process).

It is recommended to use the exec form for better performance and reliability.

---

#### BULID/lLIST/REMOVE IMAGES
```sh
docker build . -t node_app         
docker build . -t node_app:1.0.0    #specify the tag, the default is "latest"
Docker images                    #list all the images
```


| Syntax      | Description |
| ----------- | ----------- |
| -t      | to name (tag) the image       |
| .   | specify the path or the dockerfile (current dir) |
| node_app   | is the image given name        |

You will se a lot of images wit no names and to tags (dingling/loosy images) these are layers that lost their relationships with node-simple cuz of change the dockerfile and rebulding the images some layers loses their relation to the image at certain point

Docker images prune // delete images
Nothing will be deleted because there is containers that still uses these loosy images


Now we can have the same image with different version (look at image id / same)

Docker image rm node_simple
Docker image remove node-simple:1   #It will remove only the first one
-f  to force delete

Docker images prune //one more time (seccuss

Retage an image
Docker  image tag node-app:latest node-app:1

---

### CASHING LAYERS

We need to re-build the image after each change on the dockerfile or code source.

In in docker every line in an image is a layer
Docker history simple-node (to see layer their sizes )

Docker has a optimazionmichnizme of cache, Each layer depends on the one behind it , so if docker detected that a layer changed, it will re-run it and all the layers that follows it. the problem is COPY cant be cached in docker because it’s a special command,dockercant tell if something is changed or not therefore it will be run it again and everything that follows it  (when a layer is rebuild docker build all layers that follows it)

The solution put RUN npm install before COPY, but we need package*.json for that


```docker
FROM node:14.16.0-alpine3.13
RUN addgroup app && adduser -S -G app app
USER app
WORKDIR /app
COPY package* .json .
RUN npm install
COPY..
ENV API_URL=http://api.myapp.com/ 
EXPOSE 3000
CMD ["npm", "start"]
```

Docker now will run npm install only if it detect that package.json has changed
As we said before COPY . . does always run but here its fine 


Remember: 
Docker build -t node-example . (use  the same name so it will created on top of exesting one and skip cashed leyers)


explain add

---

### SHARING IMAGES

Login to docker hub
Create new repository
Docker image tag image_id_that_we_wanna_pushdockerhubuser/dockerhibimagename:tag

```bash
Docker images //we should see new created images
Docker login  //use sudo if you are not root
Docker push dockerhubuser/dockerhibimagename:tag
```

Now we can ollthis images from any machine that uses docker and run it

First push always takes time because of npm install (assuming it depencieswont change on next push)


export import images
Docker image save -o react-app.tar node-app:3

A tar file in lunix is like a zip file in winsows

Now we can take that file and run it in another machine

Docker image load -I node-app.tar

---

### CREATE A CONTAINER FROM THE IMAGE

the imager name shoudl be always at the end 
```bash
Docker run -it node_app #node_app is the image name
```
the terminal will look like this
```bash
/app             #Because we set /app as our working dir the the docker image 
node –-version   #now on the terminal we can use things like
```

If you use the `docker run` command to create a container, by default, Docker will also start the container immediately after it is created, so its a combination of

```sh
docker create node_app
docker start created_container_id
```

note: because the image is using alpine os, cuz it’s a small lunixdestribition system, but it uses shell instead so

Docker run flags

| Option | Description |
|--------|-------------|
| `-it`  | Used for interactive sessions with the container's command line shell or other interactive processes. |
| `-d`   | Used to run the container as a background process. Otherwise, it would occupy the terminal and keep showing logs. |
| `–-name`    | `–-name custom_name` #give container custom name (easy to reference later instead of randoom id) |
| `-p`  | for Publishing port, `-p 8000:3000` will make the host acess the container port 3000 and make it accessbile on the host on port 8000, Many containers can listen to same port since the run om isolatedenvironment  |

---
### LISTING CONTAINERS AND DUBBUGING 

```bash
docker ps      #list running process, because container is just a process
docker ps -a   #list all containers including those that are not running,

docker logs container_id       #see the logs of a runing a contains
docker logs -n 5 container_id  #see the last 5 line
docker logs -f container_id    #live logs

docker rm container_id  #remove a container
docker rm -f container_id  #if the container ss not stopped we need to use foce

docker start container_id  #start a stoped existing container
docker stop container_id   #stop an existing container

docker container prune #remove all stopped containers

#stoping a container will preserve that data not like deleting a container
```

Running a container with the flag -it will make the terminal interactive but if we already have a running contailer and we want to untecat with we can use:

```bash
docker exec container_id
docker exec -it container_id #run bash and iteract with it
exit #to colose the interctive mode
```
this is helpfull we we are using docker-compose and runnign many containers.


---
## VOLUMES

containers in dockers are just a running processes! And there is two types of process,  a `stateless` process and a `statefull` process

`stateless` process does not relies on storing any data on disk or ram in order to function, these processes can come and go as they please and its fine it the process it restarted

`statfull`  is the opposite but unline normal process,  containers and pod process has they own filestem that get destroyed and recrted if the process is restarted, so they cant by default make changes in the disk of the host 


We should never store our data in the container because if we delete that container, the data will go away with it, that why we use volumes:


- volume are kind of a storage on the host that we can mount to a container to presist data during the container lifecycle
-  volumes make use presist only a part or the enitre container file system
-  Multiple containser can access use and acess the same volumes
- they can be mapped to external Strorage, it makes the data are east to migrate and manageand store, since for example we known that all db record will be stored on the valome we specify so we known where the data exits !


these are commands to work with volumes
```bash
docker volume –-help             #to all possible commands
docker volume ls                 #list all the volumes
docker volume create val_name    #create a new valume
docker volume inspect val_name   #inspect a volume
docker volume rm val_name        #remove a volume
```

let we user upload some files that we save on a folder called data on the container! and we want these files to not be gone after the container is restared! to do that let mounth that folder to our volume  
```bash
Docker run -d -p 3000:3000 -v val_name:/app/data node_app
```

or we can directly mount a current folder folder on the host as volume
```bash
Docker run -d -p 3000:3000 -v ./tmp/data:/app/data
```

diff bnetween creating a voume using docker volume create and simply mouting a local folder is that creating a volume can be mroe flexiable and shared between multipe containers! but using just local folder is better for development

note : now on the containerm the intial content of the folder data will be the content that exits on the folder local_data on the host , any write on to the folder data or its content inside the conainer will be directly applied of the local-data foler, its its mounted! like this we will be able to preserve data.

#### Back up data, export and import
Lets say we have an existing valume called `mydata`

export it into a tar file:
```bash
docker volume backup mydata --destination mydata.tar
```

create a new volume on another machine for example:
docker volume create mydata

restore the back up to it
```bash
docker volume restore --input mydata.tar mydata
```

but if we dont use docker volumes and istead we mounted a locat dir durecelt as a volume, then we may just need to wrap and folder in a wip using sudo and save it until we need it

#### EXCHANGUNG FILES BETWWEN THE HOST AND CONTAINERS

Get a file from container to local machine and the opposite
```bash
#the file file.txt in the container will be
#copied to our local foder where there is the Dockerfile
docker cp container_id:/app/file.txt .

docker cp localfile.txt containe_Id:/app #send a file to a container
```


#### Rel-time changes - DEV 

Let say our container is listening on port 3000 on local host and we changed , _string from _String = “hello world” to “hello anas”
App.get(/, req,res=> _String)

The changes wont be lvie on our local host because we need to re-build the images with new source code.

In docker, for development, We can created a binding from the host to the containe

```
   HOST    --- LIVE CHANGES-->    CONTAINER
-- api                            -- app
   |   node_modules                 |   node_module      
   |-- app.js                       |-- app.js 
   |-- dockerFile                   |-- package.json 
   |-- package.json                 |-- package.json 
```

to achieve that we need to mounth the entire project code source
```sh
docker run -d -p 3000:3000 -v $(pwd):/app node_app
docker logs -f container_id
```
now if we make a change on local source code, we will see the changes on the browser
The -v flag allows you to mount a host directory as a volume inside the container, which means that any changes made to the files in the host directory will be automatically reflected in the container. 

we maight have problem with node_modules, cuz the dependcies will be installed on the container not host! and when we mountthe whoe project folder the emoty node_modules will override the the one in the container so it will be empty too!

to solve this issue! also install deps on the host or ... look at docker compose solution!


Using volumes to run app on dev and make change using the container envirment without installing node modules locally or node or anything!
docker with docker-compose where you dont need to install node locally! 
just make the changes and container will get update due to valumes
https://github.com/alexeagleson/docker-node-postgres-template/blob/master/docker-compose.yml

when way he used to mount this app made him a problem because of node_modules_like 
https://stackoverflow.com/questions/30043872/docker-compose-node-modules-not-present-in-a-volume-after-npm-install-succeeds

or just manually run npm install on the host

better approach > pust the code bass on a separate folder for example src and mount only the folder
- app
  - node_modules
  - src

 

---
## DOCKER-COMPOSE

Docker Compose is a tool for defining and running multi-container Docker applications. It allows you to define all the services and their configurations in a YAML file and start them all with a single command.

lets say we have the current projects
```
-- api
   |   backend
   |   font-end
   |-- docker-compose.yml
```


```yml
version: '3.8'

services:
  backend:
    build: ./backend
    environment:
      POSTGRES_HOST: db
      POSTGRES_PORT: 5432
      POSTGRES_DB: db_name_1
      POSTGRES_USER: db_user
      POSTGRES_PASSWORD: db_password
    ports:
      - "8000:8000"
    depends_on:
      - db
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
  db:
    image: postgres
    environment:
      POSTGRES_DB: db_name_1,db_name_2
      POSTGRES_USER: db_user
      POSTGRES_PASSWORD: db_password
    volumes:
      - db_data:/var/lib/postgresql/data/
    ports:
      - "5432:5432"

volumes:
  db_data:
```

#### Expplain the volume

this will create a volume with name db_data if it does not exits
```
volumes:
db_data:
```

but we dont need to use this is we directly mounted a local folder as a colume like:
```
    volumes:
      - ./tmp/postgres:/var/lib/postgresql/data/
```

`/var/lib/postgresql/data/` is we postgres save data by default! taht is why we are mounting that dir.


#### Expplain the xxx

Build: will create the image and run a container from a Dockerfile file! in side the api and front end folder, then environment: and port: are like using flags when runing a container 

why 27017? Because the the port that mongo db listen on if u read their image info
postgres for example listen on port 5432

image: postgres will thr the image from the repo if it does not exist an start a contrainer from it, please always provide a version to it

We can add more env variable like NODE_ENV: development on the api

THRE IS ANOTHER FLAG CALLED restart: always or o n-failure that we can add (ask mroe)


By default, docker-compose will only build the image if it doesn't already exist or if the Dockerfile has changed since the last time the image was built. If you want to force a rebuild of the image, you can use the --build option with docker-compose up.

docker-compose will give the containers default names and ids

Run a compose
Docker-compose up // to build and start the containers
Dokcer-compose up -d //detached mode
docker ps  # to see the all runing container if we wanna intercat with them


---

## Docker networking
After docker-compose up
You will see a message on the console about networking

Docker networks ls


---
in docker env can be hard cord on the page or passed to the container on run time for more flexibility <- add this to the container part

mgnix guy! copilot

in each course called depends on! example nginx guys depend on docker and git

do sql after

on prod! we can pill the image on docker hub and trigger the server to rebuild on each reload, we can use docker compose to host our app on a server








--- 

COPY package*.json . # (fails!)

COPY package*.json ./ # (works:)