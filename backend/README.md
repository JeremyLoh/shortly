# Backend for url shortener

Made using TypeScript, Express, PostgreSQL, nanoid package to generate shortUrl.
Run using Docker

Structure backend using Controller and Model (MV in MVC pattern - https://www.youtube.com/watch?v=DUg2SWWK18I)

# Running Backend Application

1. Navigate to the `backend` directory where the `Dockerfile` and `docker-compose.yaml` file are present
2. Install docker on your system
3. Build docker image for backend using `docker build -t url-shorten-backend .` (defined in `docker-compose.yaml`)
4. Run `docker compose up`
5. To access the backend app, it is running on the port defined in `docker-compose.yaml` => 13000. A request can be made to this port on localhost (for local testing)

```docker
  app:
    # run backend server
    # need to build this image using "docker build -t url-shorten-backend ."
    image: url-shorten-backend
    ports:
      # Map outsidePort:insidePort, making request to outsidePort will call container insidePort
      # e.g. if backend is listening on port 3000, => <somePort>:3000
      - 13000:3000
```

You can clean up docker images / containers etc using `docker system prune` (e.g. that are exited)

```shell
docker system prune
docker build -t url-shorten-backend .
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
