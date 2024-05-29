FROM node:18.15.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18.15.0 AS runner

ARG APP_ENV
ARG CORS_ORIGIN

ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_DATABASE
ARG TIMESCALE_DB_HOST
ARG TIMESCALE_DB_PORT
ARG TIMESCALE_DB_USERNAME
ARG TIMESCALE_DB_PASSWORD

ENV APP_ENV $APP_ENV
ENV CORS_ORIGIN http://localhost:3000,$CORS_ORIGIN

ENV DB_HOST $DB_HOST
ENV DB_PORT $DB_PORT
ENV DB_USERNAME $DB_USERNAME
ENV DB_PASSWORD $DB_PASSWORD
ENV DB_DATABASE $DB_DATABASE

# FIX VM
ENV SOCKET_PORT 80
ENV IS_VM=1
ENV IS_SCHEDULER=1

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
RUN npm install --production
USER node
EXPOSE 80
COPY --from=builder --chown=node:node /app/dist  .
CMD ["npm", "run", "start:prod"]