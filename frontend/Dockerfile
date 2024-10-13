# Use an official Nginx image as a base
FROM nginx:alpine

# Copy the static website files to the Nginx html directory
COPY ./build /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx server (the default command)
CMD ["nginx", "-g", "daemon off;"]
