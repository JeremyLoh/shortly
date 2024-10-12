FROM node:lts-slim
WORKDIR /usr/url-shorten/frontend

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 5173
# TODO change to run production build, deploy build files to server
CMD ["npm", "run", "dev"]