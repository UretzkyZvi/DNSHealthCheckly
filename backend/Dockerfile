# Use an official Node runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Make port 8081 available to the world outside this container
EXPOSE 8081

# Define the command to run your app using CMD
CMD ["npm", "start"]
