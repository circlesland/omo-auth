# omo-auth
Implements a flow that sends a "verify email address"-mail with a random code and issues a short-lived
JWT when the code was correctly validated.

## Getting started
### Prerequisites
* Docker & Docker-Compose must be installed
### Download, configure and run
1. Clone the repository and navigate to the docker compose config
    ```bash
    $ git clone https://github.com/omoearth/omo-auth.git
    $ cd omo-auth/docker 
    ```
2. Edit the provided example _.env_-file (especially the SMTP_* and AUTH_SERVICE_* values):
    ```bash
   # Which server should be used to send the emails?
    SMTP_SERVER=
    SMPT_PORT=
    SMTP_SECURE=
    SMTP_USER=
    SMTP_PASS=
    
   # The following values are used to generate the prisma connection string
    POSTGRES_HOST=postgres
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=omo-auth
    
   # The port is the port where the service listens at, the BASE_URL is used for a-href links in the sent emails
    AUTH_SERVICE_BASE_URL=https://auth.omo.earth
    AUTH_SERVICE_PORT=80
    
    AUTH_SERVICE_JWT_EXP_IN_SEC=60   # The lifetime of the issued tokens in seconds
    AUTH_SERVICE_ROTATE_EVERY_N_SECONDS=300   # Generate a new signing key-pair every N seconds
    AUTH_SERVICE_GRAPHQL_SCHEMA=omo-auth/auth/server/src/api/api-schema.graphql
    ```    
### U
When running with the above instructions, the reverse proxy will listen at _http://localhost:8080_. 
All requests to the root are forwarded to the omo-auth service which in turn provides a GraphQL interface.
