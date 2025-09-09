# Use official nginx image
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static site files
COPY . /usr/share/nginx/html

# Expose the Cloud Run port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
