FROM node:18.12.1

ARG VERSION
ARG PORT_CLIENT
ARG REACT_APP_API_URL
ARG REACT_APP_AUTH_URL
ARG REACT_APP_POLICY_URL
ARG REACT_APP_TERMS_URL
ARG REACT_APP_PRICING_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_AUTH_URL=${REACT_APP_AUTH_URL}
ENV REACT_APP_POLICY_URL=${REACT_APP_POLICY_URL}
ENV REACT_APP_TERMS_URL=${REACT_APP_TERMS_URL}
ENV REACT_APP_PRICING_URL=${REACT_APP_PRICING_URL}

LABEL version=${VERSION}
LABEL description="This is the dental management software aplication API"
LABEL maintainer = ["recepdemiric.14@gmail.com"]

# Create app directory
WORKDIR /usr/src/client

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

#To bundle your app’s source code inside the Docker image, use the COPY instruction:
COPY . .

# Build the app for production
RUN npm run build
# Install serve to serve the built application
RUN npm install -g serve

# Expose the port for the app
EXPOSE ${PORT_CLIENT}

# Serve the built app
CMD sh -c "serve -s build -l ${PORT_CLIENT}"