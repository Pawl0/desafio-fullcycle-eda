FROM --platform=linux/amd64 node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

RUN apk upgrade --no-cache && apk upgrade -U openssl

# Copy package.json, yarn.lock and package-lock.json to the working directory
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

EXPOSE 3003

RUN chmod +x docker-entrypoint.sh
ENTRYPOINT  ["sh", "./docker-entrypoint.sh"]