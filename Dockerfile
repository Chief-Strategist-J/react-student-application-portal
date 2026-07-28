# Multi-stage Dockerfile for React application using Nginx
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm install

# Copy source code and build config files
COPY . .

# Build production distribution bundle
RUN npm run build

# Production stage
FROM nginx:alpine AS runner

# Copy custom nginx configuration if needed or use default
COPY --from=build /app/dist /usr/share/nginx/html

# Copy single page app nginx config
RUN echo $'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    error_page 500 502 503 504 /50x.html;\n\
    location = /50x.html {\n\
        root /usr/share/nginx/html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
