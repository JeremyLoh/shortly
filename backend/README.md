# Backend for url shortener

Made using `TypeScript`, `Express`, `PostgreSQL`, `nanoid` package to generate shortUrl. Run using `Docker`

- `express-validator` package for validating requests using schemas
- `express-rate-limit` package to rate limit API endpoints (https://www.npmjs.com/package/express-rate-limit)
- `express-session` package for managing sessions (to have state for HTTP using cookies) (https://www.npmjs.com/package/express-session)
- `passport` package for managing local authentication with username and password (https://www.npmjs.com/package/passport)
- `argon2` package for hashing passwords (https://www.npmjs.com/package/argon2)
- `connect-pg-simple` package for session store (to save session to postgresql database) - https://www.npmjs.com/package/connect-pg-simple

Structure backend using Controller and Model (MV in MVC pattern - https://www.youtube.com/watch?v=DUg2SWWK18I)

# Running Backend Application (using Docker)

1. Create `.env` file in `backend/` directory. Replace `???` with a random value with at least 32 bytes of entropy - https://expressjs.com/en/resources/middleware/session.html

It should be quoted in single quotes - https://forums.docker.com/t/warn-0000-the-he-variable-is-not-set-defaulting-to-a-blank-string/137212

```
BACKEND_SESSION_SECRET='???'

# Add below for connecting to prod db! https://neon.tech/docs/get-started-with-neon/connect-neon
ENV='PROD'
PGUSER='????'
PGHOST='????'
PGDATABASE='????'
PGPASSWORD='????'
PGPORT='5432'
```

- E.g. connection database string contains role, password, hostname and database name

```
postgresql://fake:TESTPASSSS@aa-aaaa-????????-123456.c-east-1.eee.test.tech/dbname
             ^    ^         ^                                               ^
       role -|    |         |- hostname                                     |- database
                  |
                  |- password
```

`.env` file example

```
PGUSER=fake
PGHOST=aa-aaaa-????????-123456.c-east-1.eee.test.tech
PGDATABASE=dbname
PGPASSWORD=TESTPASSSS
PGPORT=5432
```

2. Install docker on your system
3. Navigate to the project root directory where the `docker-compose.yaml` file is present
4. Run `docker compose up`
5. To access the backend app, you can visit the reverse proxy port with `/api` endpoint. e.g. `localhost:8080/api`. The reverse proxy is running on the port defined in `docker-compose.yaml`. A request can be made to this port on localhost (for local testing)

You can clean up docker images / containers etc using `docker system prune` (e.g. that are exited)

```shell
docker system prune
docker compose up
```

# Running Tests

- Navigate to project root (where docker-compose.yaml is located) and run `docker compose run backend npm run test`

- https://docs.docker.com/guides/nodejs/run-tests/

# Database (PostgreSQL)

Column naming convention (lowercase with underscores)

- PostgreSQL naming conventions - https://stackoverflow.com/questions/2878248/postgresql-naming-conventions

# References

1. How to set up TypeScript with Node.js and Express - https://blog.logrocket.com/how-to-set-up-node-typescript-express/
2. Express JS Full Course (Anson the Developer) - https://www.youtube.com/watch?v=nH9E25nkk3I
3. Thunder Client for VS Code - https://www.thunderclient.com/
4. Express.js req.body undefined - https://stackoverflow.com/questions/9177049/express-js-req-body-undefined
5. Build a CRUD API with Docker Node.JS Express.JS & PostgreSQL - https://www.youtube.com/watch?v=sDPw2Yp4JwE
6. Docker Compose in 12 Minutes - https://www.youtube.com/watch?v=Qw9zlE3t8Ko
7. ECONNREFUSED for Postgres on nodeJS with dockers - https://stackoverflow.com/questions/33357567/econnrefused-for-postgres-on-nodejs-with-dockers
8. Build a CRUD API with Docker Node.JS Express.JS & PostgreSQL (Smoljames) - https://www.youtube.com/watch?v=sDPw2Yp4JwE
9. Postgres Identifiers (including column names) that are not double quoted will be folded to lower case - https://stackoverflow.com/questions/20878932/are-postgresql-column-names-case-sensitive
10. PostgreSQL naming conventions - https://stackoverflow.com/questions/2878248/postgresql-naming-conventions
11. Nano ID Collision Calculator - https://zelark.github.io/nano-id-cc/
12. https://express-rate-limit.mintlify.app/reference/configuration#keygenerator
13. Understanding Passport Serialize Deserialize - https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
14. Passport js always returning 500 internal error - https://stackoverflow.com/questions/29580522/passport-js-always-returning-500-internal-error
15. node-postgres: how to execute "WHERE col IN (<dynamic value list>)" query? - https://stackoverflow.com/questions/10720420/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query
16. For url LIKE query matching https://www.postgresql.org/docs/current/indexes-opclass.html - https://stackoverflow.com/questions/1566717/postgresql-like-query-performance-variations/13452528#13452528

# References (Testing)

1. Mocking express-rate-limit for unit testing - https://stackoverflow.com/questions/63160152/mocking-express-rate-limit-for-unit-testing
2. NodeJS Express Test-Driven API Development (TDD) - https://www.youtube.com/watch?v=M44umyYPiuo
3. Ensure Express App has started before running Mocha/Supertest tests - https://mrvautin.com/ensure-express-app-started-before-tests/
4. Multiple test file port 3000 already in use - https://stackoverflow.com/questions/54422849/jest-testing-multiple-test-file-port-3000-already-in-use
   - Put `app.listen` in a different file (run listen for each test file instead)
5. Setting cookie in request - https://github.com/ladjs/supertest/issues/665
   javascript

   ```javascript
   const loginResponse = await request(app)
     .post("/api/auth/login")
     .send({ username, password })
   expect(loginResponse.status).toBe(200)

   const { header } = loginResponse
   // Setting cookie in request - https://github.com/ladjs/supertest/issues/665
   const checkAuthStatusResponse = await request(app)
     .get("/api/auth/status")
     .set("Cookie", [...header["set-cookie"]])
   ```
