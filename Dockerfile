# Stage 1: Build the React application
FROM node:18-alpine AS build


# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application files
COPY . .


# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built React app from the 'build' stage to the Nginx html folder
COPY --from=build /app/build /usr/share/nginx/html/cms

# Copy a custom Nginx configuration file, if you want to tweak it
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

