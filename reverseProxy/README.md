# Reverse Proxy

Web container cannot call backend container from docker compose - https://stackoverflow.com/questions/60986908/web-container-cannot-call-backend-container-from-docker-compose

- David Maze

```
The important thing for this setup is that your actual front-end code is not running in Docker, it's running in your browser. That means it has no idea about Docker networking, containers, or anything else; the URL you give it has to be one that reaches a published port on your host. That's why localhost works here (if the browser and containers are running on the same host) but backend doesn't.

A typical approach to this is to set up some sort of reverse proxy that can both host the front-end application code and proxy to the back-end application. (For example, set up Nginx where its /api route proxy_pass http://backend:8098, and its / route either try_files a prebuilt Javascript application or proxy_pass http://frontend:8080.)

If you do this, then e.g. http://localhost:8900 is the front-end and http://localhost:8900/api is the back-end, from the browser's point of view. This avoids the CORS issues @coedycode hints at in their answer; but it also means that the front-end code can use a relative URL /api (with no host name) and dodge this whole problem.

+-------------+                  | Docker >           /     +----------+
+-------------+                  |                 /------> | frontend |
|             |  localhost:8900  |    +-------+    |        +----------+
|   Browser   | ---------------> | -> | nginx | -> +
|             |                  |    +-------+    | /api   +----------+
|             |                  |                 \------> | backend  |
+-------------+                  |                          +----------+
```

- Docker and Nginx Reverse Proxy - https://www.youtube.com/watch?v=hxngRDmHTM0

- How to Fix WebSocket Connection Error in Nginx and React on Docker - https://dev.to/ndohjapan/how-to-fix-websocket-connection-error-in-nginx-and-react-on-docker-3405

  - Web app is trying to access ws://localhost:3000/ws, which does not exist, and Nginx is running on a different port.
  - Add the location /ws into the Nginx configuration file and route it to the React client running in the Docker container.

  ```
  location /ws {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
  }
  ```

  The location block defines the URL path that should be routed to the React app running on port 3000. The proxy_pass directive sets the URL to which the request should be forwarded, and the proxy_http_version and proxy_set_header directives configure the connection between Nginx and the React app.
