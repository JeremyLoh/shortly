FROM node:22
WORKDIR /usr/url-shorten/backend

# copy everything from source to docker container
COPY . .
RUN npm install

# document port docker image is expected to listen to when run
EXPOSE 3000

CMD ["npm", "run", "start"]