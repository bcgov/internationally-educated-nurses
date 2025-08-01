FROM node:22-alpine

# Enable corepack and set yarn version to match packageManager
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

# Copying repo resources - but will be overridden by volume mounts
COPY ./packages ./packages
COPY ./apps ./apps
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./tsconfig.json ./tsconfig.json

EXPOSE 3000
EXPOSE 4000

CMD /usr/bin/tail -f /dev/null
