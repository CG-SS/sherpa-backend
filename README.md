# Sherpa Backend

This project represents the coding challenge defined on [this repo](https://github.com/joinsherpa/coding-challenge-backend). Notice that only the endpoint and data model definitions were taken from the challenge, and not the rest. The reason is that `data.json` was missing from the repository, and looking at the Git history, it seems that it never existed there. So I decided to use the spirit of the challenge, but with some changes.

It uses Nx as a building system, due to its monorepo support and powerful integrations, Yarn as the package manager, due to the fact it's overall faster due to the parallelism. 

For the backend architecture, it utilizes an async microservice architecture, due to easy scalability, and Kafka as the EBS. It also uses Prisma.js as the ORM.

As for deployment, it utilizes Docker and Kubernetes.

The event model was based on the `events.json` file located on `./challenge`.

## The challenge

For the challenge, there was the creation of a microservice architecture, with the following services:

- `events-service`: This service serves as the query service for events. It should be able to return a specific event, and all the events, using pagination. Cursor based pagination was used. The implementation can be localized on `./apps/services/events`.
- `file-uploader-service`: This service is responsible for handling the creation of a new event and for handling the upload of an event file. The implementation can be localized on `./apps/services/file-uploader`.
- `weather-service`: This service utilizes [Weather API](https://www.weatherapi.com/) to hydrate the messages with the weather forecast if the event is happening within seven days. The implementation can be localized on `./apps/services/weather`.

Each of the services have their own repository, and specific information about them can be located on their respective `README.md`.

## How to run

We utilize Kubernetes and Docker to deploy our app. Follow [this tutorial](https://docs.docker.com/compose/gettingstarted/) in order to set up Docker. If running locally, we need to set up Minikube. For that, follow the tutorial on [this page](https://minikube.sigs.k8s.io/docs/start/).

Also, you will need an `API_KEY` for the weather service. 

After setting up Minikube, we need to build all the Docker images for each service. For that, use the following command:

> yarn docker:build

That will build all the available images, including the ones used for integration testing. After that, load the images on Minikube by using the command:

> yarn minikube:images:load

After that, run the command:

> yarn k8s:start:dev

To deploy the Kubernetes cluster. To expose one of the services, use the command

> minikube service <service> --url

Example, to expose the `file-uploader` service, you can use:

> minikube service file-uploader-service-nodeport-srv-dev --url

## Yarn commands

Here is a listing of every yarn command and what they do:

- `prisma:generate`: Generates the Prisma client, based on `schema.prisma`.
- `prisma:migrate:dev`: Checks `schema.prisma` and creates a new migration if necessary.
- `prisma:migrate:deploy`: Deploys the migrations, without resetting.
- `prisma:resetdb`: Reapplies the migrations on the DB.
- `docker:build:services:events`: Builds the `events-service` docker image.
- `docker:build:services:file-uploader`: Builds the `file-uploader` docker image.
- `docker:build:services:weather`: Builds the `weather` docker image.
- `docker:build:services:events`: Builds the `events-service` docker image.
- `docker:build:services`: Builds the docker image for every service.
- `docker:build:integration:file-uploader`: Builds the docker image for the `file-uploader` integration test.
- `docker:build:integration:events`: Builds the docker image for the `events` integration test.
- `docker:build:integration`: Builds the docker image for the every integration test.
- `docker:build`: Builds every docker image available.
- `minikube:images:rm`: Removes every Docker image from Minikube's local Docker repo.
- `minikube:images:load`: Loads every Docker image to Minikube's local Docker repo.
- `k8s:start:dev`: Starts the Kubernetes cluster for the dev environment.
- `k8s:start:integration:events`: Starts the integration testing for the `events` service.
- `k8s:start:integration:file-uploader`: Starts the integration testing for the `file-uploader` service.
- `lint`: Lints all the code.
- `start`: Runs every service.
- `build`: Builds every project.
- `test`: Runs the unit tests. Notice that this only runs the unit tests, and not the integration test.

## Tests

As mentioned previously, there are unit and integration tests. Due to time constrains, an E2E test was not possible.

### Unit testing

To run the unit tests, use the command:

> yarn test

Not everything has unit testing, only pure virtual functions and some functions that have too much logic. Instead of mocking calls with Jest, it was preferred creating an integration test instead.

### Integration tests

We run the integrations tests on Kubernetes. On production, we would use something like Octopus and Helm, alongside Jenkins or other CI/CD tool in order to better orchestrate the tests inside Kubernetes, however, due to time constraints, this was not possible.

In order to run the integration test, after building the images and loading them into Minikube, like shown previously, use the following commands:

- `k8s:start:integration:events`: Starts the integration testing for the `events` service.
- `k8s:start:integration:file-uploader`: Starts the integration testing for the `file-uploader` service.

## Final considerations

There are some rough edges, due to time constraints. Because of that, some places you will notice that there were some decisions made 'for the sake of simplicity' or 'due to time constraints' (e.x hardcoded DB password, API keys, etc).

Another thing is that the Git history is not that pretty.


