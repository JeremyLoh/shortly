# URL Shortener

![url shortener homepage](./url-shortener-homepage.png)
![url shortener error page](./url-shortener-error-page.png)

Create a RESTful API that allows users to shorten long URLs. The API should provide endpoints to create, retrieve, update, and delete short URLs. It should also provide statistics on the number of times a short URL has been accessed.

# Running Application (using Docker) (frontend, backend and database)

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
5. To access the backend app, it is running on the port defined in `docker-compose.yaml` => 13000. A request can be made to this port on localhost (for local testing)
6. To access the frontend app, you should visit the reverseProxy (e.g. `localhost:8080/`. The reverse proxy port defined in `docker-compose.yaml`

You can clean up docker images / containers etc using `docker system prune` (e.g. that are exited)

```shell
docker system prune
docker compose up
```

# References

1. https://snyk.io/blog/choosing-the-best-node-js-docker-image/
2. Making sure that only reverse proxy is accessible. Create docker compose with all of the services. Don't expose any ports except for the reverse proxy. All the other containers will be accessible via their internal ports from the reverse proxy container using the container name - https://www.reddit.com/r/docker/comments/10padx3/restrict_access_to_services_only_through_nginx/

# Requirements

API should allow users to perform the following operations:

- Create a new short URL
- Retrieve an original URL from a short URL
- Update an existing short URL
- Delete an existing short URL
- Get statistics on the short URL (e.g number of times accessed)

You can optionally setup a minimal frontend to interact with the API and setup redirects for the short URLs to the original URLs

![high level application feature](https://assets.roadmap.sh/guest/url-shortener-architecture-u72mu.png)

**For this project, the backend endpoints have been appended with /api** (e.g. `POST /shorten` becomes `POST /api/shorten`)

# API Endpoints

## Create Short URL

Create a new short URL using the `POST` method

```
POST /api/shorten
{
  "url": "https://www.example.com/some/long/url"
}
```

The endpoint should validate the request body and return a `201 Created` status code with the newly created short URL

```json
{
  "id": "1",
  "url": "https://www.example.com/some/long/url",
  "shortCode": "abc123",
  "createdAt": "2021-09-01T12:00:00Z",
  "updatedAt": "2021-09-01T12:00:00Z"
}
```

Or a `400 Bad Request` status code with error messages in case of validation errors. Short codes MUST be unique and should be generated randomly

## Retrieve Original URL

Retrieve the original URL from a short URL using the `GET` method

```
GET /api/shorten/abc123
```

The endpoint should return a `200 OK` status code with the original URL

```json
{
  "id": "1",
  "url": "https://www.example.com/some/long/url",
  "shortCode": "abc123",
  "createdAt": "2021-09-01T12:00:00Z",
  "updatedAt": "2021-09-01T12:00:00Z"
}
```

Or a `404 Not Found` status code if the short URL was not found. Your frontend should be responsible for retrieving the original URL using the short URL and redirecting the user to the original URL

## Update Short URL

Update an existing short URL using the `PUT` method

```
PUT /api/shorten/abc123
{
  "url": "https://www.example.com/some/updated/url"
}
```

The endpoint should validate the request body and return a `200 OK` status code with the updated short URL

```json
{
  "id": "1",
  "url": "https://www.example.com/some/updated/url",
  "shortCode": "abc123",
  "createdAt": "2021-09-01T12:00:00Z",
  "updatedAt": "2021-09-01T12:30:00Z"
}
```

or a `400 Bad Request` status code with error messages in case of validation errors. It should return a `404 Not Found` status code if the short URL was not found

## Delete Short URL

Delete an existing short URL using the `DELETE` method

```
DELETE /api/shorten/abc123
```

The endpoint should return a `204 No Content` status code if the short URL was successfully deleted or a `404 Not Found` status code if the short URL was not found

## Get URL Statistics

Get statistics for a short URL using the `GET` method

```
GET /api/shorten/abc123/stats
```

The endpoint should return a `200 OK` status code with the statistics

```json
{
  "id": "1",
  "url": "https://www.example.com/some/long/url",
  "shortCode": "abc123",
  "createdAt": "2021-09-01T12:00:00Z",
  "updatedAt": "2021-09-01T12:00:00Z",
  "accessCount": 10
}
```

or a `404 Not Found` status code if the short URL was not found

## Check whether url is malicious

```
POST /api/malicious/check-url
```

The endpoint returns a `200 OK` with JSON body `{ verdict: "safe" }` or `{ verdict: "malicious" }`

If the request is invalid (e.g. missing url in request body), HTTP `400` will be returned

# Authentication Endpoints

## Login with existing account

Request login for an existing account

```
POST /api/auth/login
```

The endpoint returns a `200 OK` status code when successful. `401` status code is returned during failure

## Logout of signed in account

Request logout for current account

```
POST /api/auth/logout
```

The endpoint returns a `200 OK` status code when successful. `401` status code is returned during failure

## Create new account

Create a new account for authentication

```
POST /api/auth/users
```

The endpoint returns a `200 OK` status code when successful. `401` status code is returned during failure

## Get status of account based on token (TODO maybe not needed)

Check auth status of an existing cookie

```
GET /api/auth/status
```

The endpoint returns a `200 OK` status code when cookie is valid. `404` status is returned during failure or cookie is invalid

https://roadmap.sh/projects/url-shortening-service
