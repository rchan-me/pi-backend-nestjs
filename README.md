# Pi Securities Backend Assignment

### Setup

1. run `yarn install` to install dependencies
2. create a copy of `.env.example` and rename it to `.env`
   ```sh
     cp .env.example .env
   ```
3. run `docker compose up --build` to build its Docker image and start this app at `http://localhost:4000`
4. update value for `DATABASE_HOST` in `.env` to be `localhost` prior to the next step
   1. this is due to Postgres itself getting exposed through Docker's network interface via port 5432, but its service name `postgres` does not, so it is unreachable via its direct service name
5. run `yarn db:migrate` to apply any pending migration(s)
   1. must always run this command the first time around, in order to initialize table(s)
6. run `yarn test:cov` to run all unit and integration tests, along with generating the coverage report at the end

### Future Plan

1. Create a separate Dockerfile for building production images
2. Add more test scenarios, both unit and integration tests
3. Secure endpoints with JWT authentication (passportjs module supports this)
4. Fix hot reloading for NestJS app when it's running inside docker compose
5. Create exception filters for handling errors NestJS style

### Design decisions

- For `PUT /users/:userId ` endpoint, the correct definition is to modify the whole resources. However, since Prisma is already managing some metadata resources (such as updated timestamp or record ID), I do not allow end users to modify such resources

### API Contracts

After NestJS app has started from step 4, you can access Swagger documentation at `http://localhost:4000/docs`
