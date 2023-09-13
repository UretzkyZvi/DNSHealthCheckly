# DNS HealthCheckly Frontend

This frontend project is built using Next.js and is part of the DNS HealthCheckly application. The project is initially bootstrapped with `create-t3-app` and has undergone several changes to fit its purpose.

## Tech Stack

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Getting Started with Docker Compose

This project is configured to run using Docker Compose. This makes setting up a local development environment quick and easy.

To run the project:

1. Make sure Docker and Docker Compose are installed on your machine.
2. Navigate to the root directory where `docker-compose.yml` is located.
3. Run `docker-compose up`.

This will start the frontend service and its dependencies. The frontend will be accessible at `http://localhost:3000`.


### Environment Variables

The frontend communicates with the backend API. The API URL can be set using the `API_URL` environment variable in the `docker-compose.yml` file. The current configuration is set to communicate with the backend service.

```yml
environment:
  - API_URL="http://backend:8081"