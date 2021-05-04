FROM node

WORKDIR /usr/src/app

COPY . .

RUN yarn --freeze-lockfile

RUN if [ "$NODE_ENV" = "prod" ]; then yarn test || exit 1; fi
