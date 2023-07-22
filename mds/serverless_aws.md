### Simple Lamda function

this need aws to be configured

install serveless globally and create a new project with the command

```bash
---
```

you will get a template with a basic exaple, there is tw important files index.js and serverless.yal

```yaml
# general config
org: organization_name
app: app_name
service: app_service_name
frameworkVersion: "3"

# config about the provider
provider:
  name: aws
  runtime: nodejs18.x

# the serverless functions
functions:
  function1_name:
    handler: index.handler
```

index refersh the the inndex.js file and handler it a function

```js
module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v3.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

serverless invoke --function hello
Which should result in response similar to the following:

{
"statusCode": 200,
"body": "{\n \"message\": \"Go Serverless v3.0! Your function executed successfully!\",\n \"input\": {}\n}"
}

### Local development

You can invoke your function locally by using the following command:

serverless invoke local --function hello
Which should result in response similar to the following:

{
"statusCode": 200,
"body": "{\n \"message\": \"Go Serverless v3.0! Your function executed successfully!\",\n \"input\": \"\"\n}"
}

### Lamda + Custom containers (ECR DOCKER)

createa a custom docker image for the container

```docker
# this Docker image is preconfigured with the AWS SDK for Node.js.
FROM amazon/aws-lambda-nodejs:18

# /var/task is the working used by AWS Lambda
# if you set different working directory name, it will crash
WORKDIR /var/task

COPY index.js ./app

CMD [ "app/index.handler" ]
```

```yaml
org: swace
app: video-processor
service: video-processor

#will automatically load the .env file
plugins:
  - serverless-dotenv-plugin

provider:
  name: aws
  runtime: nodejs18.x
  ecr:
    images:
      video-processor:
        path: .
  timeout: 200
  region: eu-north-1
package:
  exclude:
    - layers/**
    - node_modules/**
    - src/**
    - .vscode/**
    - git/**

functions:
  video-processor:
    image:
      name: video-processor
      command: app/index.handler
```

#### test it locally

we can simple test it locally using jest by sending the fucntion parameter but it the function depends on the container we can test it inside docker

```yaml
version: "3.8"
services:
  myapp:
    build:
      context: .
      dockerfile: Dockerfile
    env_file:
      - .env
    volumes:
      - ./dist:/var/task/app
    ports:
      - 9000:8080
```

docker-compose up --build -d

send a post request to this endpoint (use postman)

curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d
'
{
"bucketSpace": "movh",
"generateCoverImage": true,
"variants": [{ "width": 640, "height": 480, "format": "mp4" }]
}
'
note : when you make a change on the source code run

yarn refresh

"scripts": {
"build": "tsc",
"refresh": "tsc && docker-compose restart"
},

#### deploy

add this to the package json scripåt based on the envirement (development or production)

"deploy" : "sls deploy --stage development"

servelerss will take care of deploying the functio and container to aws

### allow other regions

install the packege @serverless locally and make sure node_modules/@serverless/dashboard-plugin/lib/plugin.js exits

create a patch script

```bash
#!/bin/bash

# Overrides so that eu-north-1 is still installed even though its not supported by serverless-dashboard
sed -i -e 's/!supportedRegions.includes(region)/false/' node_modules/@serverless/dashboard-plugin/lib/plugin.js
```

add it the package json and run yarn or npm to execute it

"scripts": {
"postinstall": "bash postinstall_patch.sh",
},

### call the function using the sdk

on development! its better to call the fucntion from the url http://localhost:9000/2015-03-31/functions/function/invocations, but on production we use the sdk to call the function by its name

---

https://www.serverless.com/framework/docs/getting-started
