# Backend for url shortener

Made using `TypeScript`, `Express`, `PostgreSQL`, `nanoid` package to generate shortUrl. Run using `Docker`

- `express-validator` package for validating requests using schemas
- `express-rate-limit` package to rate limit API endpoints (https://www.npmjs.com/package/express-rate-limit)
- `express-session` package for managing sessions (to have state for HTTP using cookies) (https://www.npmjs.com/package/express-session)
- `passport` package for managing local authentication with username and password (https://www.npmjs.com/package/passport)
- `argon2` package for hashing passwords (https://www.npmjs.com/package/argon2)

Structure backend using Controller and Model (MV in MVC pattern - https://www.youtube.com/watch?v=DUg2SWWK18I)

# Running Backend Application (using Docker)

1. Install docker on your system
2. Navigate to the project root directory where the `docker-compose.yaml` file is present
3. Run `docker compose up`
4. To access the backend app, you can visit the reverse proxy port with `/api` endpoint. e.g. `localhost:8080/api`. The reverse proxy is running on the port defined in `docker-compose.yaml`. A request can be made to this port on localhost (for local testing)

You can clean up docker images / containers etc using `docker system prune` (e.g. that are exited)

```shell
docker system prune
docker compose up
```

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
