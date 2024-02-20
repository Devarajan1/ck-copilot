FROM node:18-bullseye-slim
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN  npm install && npm i -g next@13.5.3
RUN npm run build
CMD "next" "start"
