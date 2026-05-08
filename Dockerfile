# Use an official Node.js image as the base image
FROM node:24-alpine AS build

# Set the working directory in the container
WORKDIR /app

COPY . .

# Install global dependencies
RUN npm install --global expo-cli

# Install project dependencies (including devDependencies)
RUN npm ci
RUN npm run predeploy

FROM nginx:alpine

WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8001

CMD ["/bin/sh", "-c", "nginx -g \"daemon off;\""]