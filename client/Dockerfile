FROM node:18.12.1

ARG VERSION
ARG PORT_CLIENT

LABEL version=${VERSION}
LABEL description="This is the dental management software aplication API"
LABEL maintainer = ["abdullah.keskin1598@gmail.com", "r.cancorduk@gmail.com", "recepdemiric.14@gmail.com", "tnhnatalay@gmail.com"]

# Create app directory
WORKDIR /usr/src/client

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

#To bundle your app’s source code inside the Docker image, use the COPY instruction:
COPY . .

#Your app binds to port 3000 so you’ll use the EXPOSE instruction to have it mapped by the docker daemon:
EXPOSE ${PORT_CLIENT}

CMD ["npm", "start"]