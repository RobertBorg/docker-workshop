## Introduction
Docker is primarly used for building images and running those images in containers
`docker build -t backend:latest .` would build the Dockerfile located at `.` and tag the image as `backend:latest`
After building and tagging an image you can view locally available images with `docker image list`.
`docker run --rm backend:latest` spins up a new container in foreground and instructs docker to remove the container once it exits.

## Getting up and running
While easing into it lets spin up a hello world kind of container. At https://hub.docker.com/_/nginx we find a variety of readily available nginx images. Lets pick and run one.
Choosing which image to use can be daunting. Personally i look for a few criterias:
* official images to minimize risk of getting images with backdoors
* alpine linux (https://alpinelinux.org) based images for minimal size
* locked down versions because i like reproducable builds
Using those criterias i ended up picking nginx:1.15.8-alpine. Lets run it and see what happens.
Running `docker run --rm nginx:1.15.8-alpine` gives no output. It does however start the cointainer.
Running `docker ps` in a different terminal shows you that there is in fact a container based off the nginx:1.15.8-alpine image running.
In order for us to be able to reach nginx we need to map the ports. This can be done with the `-p [host port]:[container port]` switch to the `docker run` command.
When you've started the container correctly the port mapping will be visible in ports column in `docker ps` output.
You should also be able to see the nginx start page by visting http://localhost:[host port] in your favorite browser.

## Writing a backend to dockerize
Pick you favorite backend language, write simple application that responds with Hello world or similar to http requests on port 80 with url === '/' and 404 to everything else.
## Let the Dockerizing begin
You need to create a file named `Dockerfile` which contains instructions which will be used to build your docker image.
A reference can be found at https://docs.docker.com/engine/reference/builder/
it usually goes something like this
```
FROM baseimage:tag

RUN [install dependencies]

#This uses .dockerignore like .gitignore to choose what to actually copy.
COPY . .

RUN [actually build app]

CMD build/app

EXPOSE 80

```
There is a more effective way to make small image, namely making use of multi stage builds. That usually looks something like this.
```
FROM builderbase:tag as builder

RUN [install build dependencies]

COPY . .

RUN [actually build app]

FROM runtimebase:tag

COPY --from builder build/app .

CMD ./app

EXPOSE 80

```
So now we're back to choosing base images. For statically compiled languages like rust or go i'd simply recommend compiling in all dependencies and using scratch as base image for the runtime. For languages that actually require some kind of runtime best bet is probably https://github.com/GoogleContainerTools/distroless and if not available for your language try to build upon https://hub.docker.com/_/alpine for minimal size and attack vector.

### Optimizing for CI
When you enter the promised land of CI/CD using docker and images that are built like these you will end up rebuilding your builder image over and over if using a docker in docker solution where you have a clean slate. To combat this problem you can use `--cache-from` and `--target` flags available for the `docker build` command in order to output partial build images and reusing them as a cache for future builds

## Integrating with other applications
Now that our Hello World app is up and running we'd like to move on to bigger and greater things. Lets do an integration either between two different apps of your own making or redis and your application.

Change your application to get and increase a counter in a redis instance and print the nubmer as part of the response.
### Docker networking
To complete this challenge you will need to use 
* `docker network` and its subcommands
* `-e` flag on `docker run`