FROM node:18.12.1

ARG VERSION
ARG PORT_SERVER

LABEL version=${VERSION}
LABEL description="This is the dental management software aplication API"
LABEL maintainer = ["recepdemiric.14@gmail.com"]

# Create app directory
WORKDIR /usr/src/server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install

#To bundle your app’s source code inside the Docker image, use the COPY instruction:
COPY . .

#Your app binds to port 3000 so you’ll use the EXPOSE instruction to have it mapped by the docker daemon:
EXPOSE ${PORT_SERVER}

CMD ["npm", "start"]