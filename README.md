# Sherpa Backend

This project represents the coding challenge defined on [this repo](https://github.com/joinsherpa/coding-challenge-backend). Notice that only the endpoint and data model definitions were taken from the challenge, and not the rest.

It uses Nx as a building system, due to its monorepo support and powerful integrations, Yarn as the package manager, due to the fact it's overall faster. 

For the backend architecture, it utilizes an async microservice architecture, due to easy scalability, with an API gateway with GraphQL for more safety and easier frontend development. It also uses Prisma.js as the ORM.

As for deployment, it utilizes Docker and Kubernetes.

The reference and anything utilized from the challenge repo are located on `./challenge`.


