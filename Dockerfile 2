FROM node:20-alpine

# Install required system dependencies
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    vips-dev \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /opt/app

# Copy package files
COPY ./strapi-cms/package.json ./

# Create package-lock.json if it doesn't exist
RUN npm install --package-lock-only

# Install dependencies
RUN npm ci || npm install

# Copy application files
COPY ./strapi-cms .

# Create required directories
RUN mkdir -p public/uploads

# Build will happen at runtime since we're in development mode

# Expose port
EXPOSE 1337

# Start Strapi in development mode
CMD ["npx", "strapi", "develop"]