FROM node:18.12.1

LABEL version="1.0"
LABEL description="This is the dental management software aplication API"
LABEL maintainer = ["abdullah.keskin1598@gmail.com", "r.cancorduk@gmail.com", "recepdemiric.14@gmail.com", "tnhnatalay@gmail.com"]

# Create app directory
WORKDIR /usr/src/server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install

#To bundle your app’s source code inside the Docker image, use the COPY instruction:
COPY . .

#Your app binds to port 3000 so you’ll use the EXPOSE instruction to have it mapped by the docker daemon:
EXPOSE 8080

CMD ["npm", "start"]