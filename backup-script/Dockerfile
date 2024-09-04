FROM node:18-alpine

# Create working directory inside the container
WORKDIR /usr/src/backup-script

#To bundle your app’s source code inside the Docker image, use the COPY instruction:
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Install additional tools needed for the backup script
RUN apk add --no-cache docker-cli

# Run the application (cron will start and manage backup tasks)
CMD ["node", "backup.js"]
