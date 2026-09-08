# ================================================================
# STAGE 1: BUILD STAGE
# ================================================================
FROM node:20-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package manifests first for optimal Docker layer caching
COPY package.json ./

# Install project dependencies
RUN npm ci || npm install

# Copy application source code
COPY . .

# Build Vite production application
RUN npm run build

# ================================================================
# STAGE 2: PRODUCTION STAGE
# ================================================================
FROM nginx:alpine AS production-stage

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production dist output from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Health check to ensure Nginx web server is responsive
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
