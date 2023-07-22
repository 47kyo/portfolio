### 1. USE CASE

Lets say I build an app that need node 14 but all team member has node 16 etc.. they all need to downgrade to test the app, docker solve this problem by creating something like a vurtiualmaciie but more optimized called a container that contain the app its self with all it specific dependencies and technologies needed

---

### 2. CONTAINERS VS VIRTUAL MACHINE

- Container is a process of running an application, they run on an isolated environment and because a container is just a process, it can be stopped and restored easily.

- A VM on the other hand is an abstraction of a machine (physical hardware) means its less efficient and resources expensive, each VM needs a fully-blown copy of a OS

Containers are lightweight, use the OS of the host, start quicklyand uses resources smartly, they uses just what they need unlike VM that take a part of the host resources even if its not doing anything.

---

### 3. IMAGES

#### 3.1. OVER VIEW

Images are a combanation of layers as a blueprints for creating containers, these layers are:

- Runtime environment/parent image (e.g., node with Ubuntu)
- Application code source
- Dependencies succh as libraries needed to run the app
- Environment variables (secrets and configuration values)
- Commands (executes cmds on both runtime and buildtime)

You can find all images with a parent layer [here](https://hub.docker.com/search?q=), which is a repository of Docker images. It contains pre-made parent images that can be used as the first layer in our Docker image.

To pull the Node image, open the terminal and type

```bash
docker pull image_name
```

_It is always advised to specify a version, or it will always grab the latest one, which can change and make the environment unstable._

#### 3.2 CREATE AN IMAGE

we create an imaje using a `Dockerfile` file (no extention)

Lets say we have an express app that is listing on port 4000

```yaml
-- api
|-- app.js
|-- dockerFile
|-- package.json
```

As known, to run this app, we need

- os
- nodejs installed
- install node dependencies located on package.js
- run the command `node app.js `

So this is how the dockerFile image should look like, Each step on the dockerfile is a **layer**

```bash
FROM node:17-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 4000
ENV envirement=development
CMD ["node", "app.js"]
```

#### 3.3 EXPLAIN THE IMAGE LAYERS

`FROM node:17-alpine` is the parent layer, we specify our container base image.

- It will be pulled from Docker Hub or our local machine if already downloaded.
- we used Alpine here because its a lightweight Linux distribution (only 39MB).
- _It is always advised to specify a version, or it will always grab the latest one, which can change and make the environment unstable._
- A base image can consist of just the OS so we can just use Alpine as the base layer and manually install Node using a command.

`COPY . .` To copy our local files such as source code to the image.

- The first `.` refers to the folder where the Dockerfile is located
- The second `.` represents the root path inside the Docker image.

**PLEASE NOTE:** Since we set the working directory in the image to /app (`WORKDIR /app`), it will be effect our copy layer to `COPY . ./app`, we use `WORKDIR` to avoid conflicts and provide a specific folder to work with.

**PLEASE NOTE:** It's recommended to add a `.dockerignore` file to specify files that should be ignored, such as `node_modules`. becaise these file can be installed on the cotainer instead to reduce image build time on each update!

`ADD . .` instruction is similar to `COPY`, but also allows us to add files from a URL or extract compressed files. For example:

```bash
ADD http:image.png .
ADD data.zip .
```

`RUN npm install` instruction executes a shell command _during build time_, which occurs when the image is being built.

Be awar that in the dockerfile some commands `RUN apt install python` wont work cuz alpine does use apt package manager.

`CMD ["node", "app.js"]` instruction defines the command that will run _during run time_ when the container starts. Unlike `RUN`, which runs during build time. so we are saying to the container to start the node server when ever it start.

The `CMD` command can be written in two forms:

- Shell form: `CMD npm start` (runs the command on another shell, `/bin/sh`).
- Exec form: `CMD ["npm", "start"]` (runs the command without spawning another shell process).

It is recommended to use the exec form for better performance and reliability.

`EXPOSE` instruction is used to inform user or the server that hosts the container about the ports the container will listen on at runtime. It serves as documentation and doesn't perform any special actions.

`ENV envirement=development` allows us to add environment variables that can be accessible in our container/process, from example in node.js we can get that env by using `process.env.envirement` (its not adviceble to use env values here! but it on a file to be more flexible, see the env part)

#### 3.4 BULID IMAGES

```sh
docker build . -t node_app
docker build . -t node_app:1.0.0    #specify the tag, the default is "latest"
```

<table>
  <tr>
    <th>Syntax</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>-t</td>
    <td>to name (tag) the image</td>
  </tr>
  <tr>
    <td>.</td>
    <td>specify the path or the dockerfile (current dir)</td>
  </tr>
  <tr>
    <td>node_app</td>
    <td>is the image given name</td>
  </tr>
</table>

#### 3.5 MANAGE IMAGES /gpt clean/

**NOTE:** some layers loses their relation to the image at certain point cuz of change the dockerfile and rebulding the images, so you might see a lot of images with no names or tags (dingling/loosy images)

Docker images prune // delete images
Nothing will be deleted because there is containers that still uses these loosy images

Now we can have the same image with different version (look at image id / same)

```sh
Docker images                    #list all the images

Docker image rm node_simple
Docker image remove node-simple:1 #It will remove only the first one
-f to force delete

Docker images prune //one more time (seccuss

Retage an image
Docker image tag node-app:latest node-app:1

```

#### 3.6 CASHING LAYERS

We will need to re-build the image after each change on the source code.

As mentioned before in docker every line in an image is a layer

```sh
docker history my_image_name #to see layer with info like their sizes
```

Docker has a optimazionmichnizme of cache, _Each layer depends on the one behind it_, so if docker detected that a layer changed, it will re-run it and all the layers that follows it.

**the problem** is `COPY . .` cant be cached in docker because it’s a special command, docker cant tell if something is changed or not therefore it will be run it again and everything that follows it.

The solution is to add `COPY package* .json .` and move `COPY . .` after installing the package which takes time

```yaml
FROM node:14.16.0-alpine3.13
WORKDIR /app
COPY package*.json /.
RUN npm install
COPY..
EXPOSE 3000
CMD ["npm", "start"]
```

Now, if we rebuild the image, Docker now will run `RUN npm install` _only if it detect that package.json has changed_

**note:** : `COPY package* .json ./` can be cashed, but why not `COPY . .` ? The answer is

- When you use the `COPY package\*.json` Docker will only copy the package.json files and any matching pattern like package-lock.json.
- On the other hand, when you use the `COPY . .` instruction, Docker will copy the entire context (i.e., the entire build directory) which docker concider to be quite large. so docker cannot leverage the cache for this instruction. Even if a single file in the context changes, Docker will consider it as a change in the entire context, and all subsequent build steps will need to be executed again

**note:** the destination syntax of using `COPY` to copy specific or a known group of files is diffrent:

- `COPY package\*.json .` # (fails!)
- `COPY package\*.json ./` # (works:)

**remember to use the same my_image_name if you rebuild**

```yaml
docker build -t my_image_name . #use the same name so it will created on top of exesting one and skip cashed leyers
```

#### 3.7 SHARING IMAGES

- Login to docker hub
- Create new repository
- Build an Image that you want to push with a tag that has your docker hub user_name

```bash
docker images   # we should see new created images
docker login    # use sudo if you are not root
docker push     # dockerhub_username/my_image_name:tag
```

Now we can pull the image `dockerhub_username/my_image_name` from any other device an run the container.

#### 3.8 EXPORT & IMPORT IMAGES

```bash
docker image save -o file_name.tar my_image_name:tag
```

Now we can use that file to restore that image on another device

```bash
docker image load -I file_name.tar
```

---

### 4. CONTAINERS

#### 4.1 CREATE A CONTAINER

```bash
docker create --name container_name image_name
docker create image_name # docker will give the container a random name based on the image_name to easily identifies it later

docker start -it container_name
```

the terminal will look like this after starting a container

```bash
/app             #Because we set /app as our working dir the the docker image
node –-version   #now on the terminal we can use things like
```

**NOTE:** If you use the `docker run --name my_container_name my_image_name`,

- Docker by default will create the container its not created and also start the container immediately after it is created
- so its a combination of `docker build my_image_name` and `docker start container_name`
- if we dont specify `my_container_name` docker will give the container a random name based on the image_name to easily identifies it later

Docker `run` and `start` flags

<table>
  <tr>
    <th>Option</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>-it</td>
    <td>Used for interactive sessions with the container's command line shell or other interactive processes.</td>
  </tr>
  <tr>
    <td>-d</td>
    <td>Used to run the container as a background process. Otherwise, it would occupy the terminal and keep showing logs.</td>
  </tr>
  <tr>
    <td>--name</td>
    <td>--name custom_name #give container custom name (easy to reference later instead of random id)</td>
  </tr>
  <tr>
    <td>-p</td>
    <td>for Publishing port, -p 8000:3000 will make the host access the container port 3000 and make it accessible on the host on port 8000. Many containers can listen to the same port since they run in an isolated environment.</td>
  </tr>
    <tr>
    <td>-v</td>
    <td>presist data see .....</td>
  </tr>
</table>

#### 4.2 MANAGING CONTAINERS

```bash
docker ps      #list running process, because container is just a process
docker ps -a   #list all containers including those that are not running,

docker rm container_id_or_name  #remove a container
docker rm -f container_id_or_name  #if the container ss not stopped we need to use foce

docker start container_id_or_name  #start a stoped existing container
docker stop container_id_or_name   #stop an existing container

docker container prune #remove all stopped containers

#stoping a container will preserve that data not like deleting a container
```

#### 4.3 DUBBUGING CONTAINERS

Running a container with the flag `-it` will make the terminal interactive but if we already have a running contailer and we want to untecat with we can use `docker exec` , this is helpfull we we are using docker-compose and runnign many containers.

```bash
docker exec container_id_or_name
docker exec -it container_id_or_name #run bash and iteract with it
exit #to colose the interctive mode
```

To simply see a container logs we can use `docker logs`

```bash
docker logs container_id_or_name       #see the logs of a runing a contains
docker logs -n 5 container_id_or_name  #see the last 5 line
docker logs -f container_id_or_name    #live logs
```

---

### 5. VOLUMES

containers in dockers are just a running processes! And there is two types of process, a `stateless` process and a `statefull` process

- `stateless` process does not relies on storing any data on disk or ram in order to function, these processes can come and go as they please and its fine it the process it restarted
- `statfull` is the opposite but unline normal process, containers and pod process has they own filestem that get destroyed and recrted if the process is restarted, so they cant by default make changes in the disk of the host

We should never store our data in the container because if we delete that container, the data will go away with it, that why we use volumes:

- volume are kind of a storage on the host that we can mount to a container to presist data during the container lifecycle
- volumes make use presist only a part or the enitre container file system
- Multiple containser can access use and acess the same volumes
- they can be mapped to external Strorage, it makes the data are east to migrate and manageand store, since for example we known that all db record will be stored on the valome we specify so we known where the data exits !

these are commands to work with volumes

```bash
docker volume –-help             #to all possible commands
docker volume ls                 #list all the volumes
docker volume create val_name    #create a new valume
docker volume inspect val_name   #inspect a volume
docker volume rm val_name        #remove a volume
```

#### 5.1 MOUNT A VOLUME

let we user upload some files that we save on a folder called data on the container! and we want these files to not be gone after the container is restared! to do that let mounth that folder to our volume

```bash
docker run -v val_name:/app/data container_name
```

**note:** now on the containerm the intial content of the folder data will be the content that exits on the folder local_data on the host , any write on to the folder data or its content inside the conainer will be directly applied of the local-data foler, its its mounted! like this we will be able to preserve data.

#### 5.2 MOUNT A HOST PATH AS A VOLUME

**note:** instead of creating a avolume, we can directly mount a local folder in the host machine as a volume

```bash
docker run -v ./tmp/data:/app/data container_name
```

diffrence bnetween creating a voume using docker volume create and simply mouting a local folder is that creating a volume can be mroe flexiable and shared between multipe containers! but using just local folder is better for development

#### 5.3 BACKUP AND RESTORE VOLUMES

Lets say we have an existing valume called `mydata`, we can export it into a tar file:

```bash
docker volume backup mydata --destination mydata.tar
```

to restore it on another machine:

```bash
docker volume create mydata
docker volume restore --input mydata.tar mydata
```

**note:** but if we dont use docker volumes and istead we mounted a locat dir durecelt as a volume, then we may just need to wrap and folder in a wip using sudo and save it until we need it

#### 5.4 REALTIME CHANGES - DEV

Let say our container is listening on port 3000 on local host and we changed , \_string from \_String = “hello world” to “hello anas”
App.get(/, req,res=> \_String)

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

### 6. EXCHANGING FILES BETWEEN THE HOST AND CONTAINER

Get a file from container to local machine and the opposite

```bash
#the file file.txt in the container will be copied to our local foder where there is the Dockerfile
docker cp container_id:/app/file.txt .

#send a file to a container
docker cp localfile.txt containe_Id:/app
```

---

### 7. DOCKER-COMPOSE

docker compose is a tool for defining and running multi-container Docker applications. It allows you to define all the services and their configurations in a YAML file and start them all with a single command.

lets say we have the current projects

```
-- api
   |   backend
   |   font-end
   |-- docker-compose.yml
```

```yml
version: "3.8"

services:
  backend:
    build: ./backend
    restart: always
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
      - db_data:/var/lib/postgresql/data/ # /var/lib/postgresql/data/ is we postgres save data by default
    ports:
      - "5432:5432" # 5432 is the port that the postgres is using inside its container

volumes: # this will create a volume with name db_data if it does not exits
  db_data:
```

but we dont need to use this is we directly mounted a local folder as a colume like:

```yml
db:
  volumes:
    - ./tmp/postgres:/var/lib/postgresql/data/
```

- `build ./backend` will create the image and run a container from a Dockerfile file in
- `image: postgres` will pull the the image from the repo if it does not already exist locally, then it will start a contrainer from it, please always provide a version to it
- `restart: always` default is "no", docker will automatically restart the container if it stops, regardless of the exit status, u can read more about other values.

By default, docker-compose will only build the image if it doesn't already exist but wont rebuild it if the Dockerfile has changed since the last time the image was built. If you want to force a rebuild of the image, you can use the `--build` option with docker-compose up.

Run a compose

```yml
Docker-compose up # to build and start the containers
Dokcer-compose up -d # detached mode
docker ps # to see the all runing container if we wanna intercat with them
```

docker-compose will give the containers default names and ids

```
extra

--build with compse wont force the image skip cash!

we can restart the container manually
When using docker-compose restart, it restarts the containers defined in your docker-compose.yml file without removing or clearing any data directories or volumes. If you want to clear the tmp directory in your container, you can follow these steps:

And the cotainer id remain the same (docker ps)


By default, Docker Compose does not rebuild the image if the code changes, assuming that
docker-compose up --build
https://chat.openai.com/c/1c0feca9-55df-4adc-8baf-9fee7675235b

```

---

### 8. Docker networking

After docker-compose up
You will see a message on the console about networking

Docker networks ls

---

### 9. DVANCED : BUILDING IMAGES WITH PERMISSION

RUN addgroup app && adduser -S -G app app
USER app

change all simple-node or simple_node to my_image_name

### 10. docker iamges example

https://github.com/orgs/mogenius/repositories?type=all

### 11. ENV

dotenv only manages the env variables but setting them up on build them
we can manually run RUN ON BUSH

EXPORT MY_ENV="ENV" see lunix course
then we can access them using process.env

alternavely on docker
we can use
ENV MY_ENV="ENV"
or
run EXPORT MY_ENV="ENV"
or
docker run --env-file .env my_image
or
with docker compose
myservice:
image: <image_name>
env_file: - web-variables.env
or with docker compose
myservice:
image: <image_name>
enviremnt: - a = b
