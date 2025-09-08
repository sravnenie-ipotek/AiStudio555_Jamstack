# CUSTOM LIVE API SERVER - NOT STRAPI!
# This replaces Strapi due to v5 API bug (all endpoints return 404)
FROM node:20-alpine

# Install SQLite for development fallback and PostgreSQL client for production
RUN apk add --no-cache sqlite postgresql-client

# Set working directory to /opt/app (Railway default)
WORKDIR /opt/app

# Copy package files from root (NOT strapi-cms!)
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy our custom server files
COPY server.js ./
COPY migrate-to-railway.js ./

# Copy frontend files
COPY *.html ./
COPY css ./css/
COPY js ./js/
COPY images ./images/
COPY fonts ./fonts/
COPY scripts ./scripts/
COPY authentication-pages ./authentication-pages/
COPY template-pages ./template-pages/

# Copy language-specific builds
COPY dist ./dist/

# Copy Live API files
COPY strapi-home-integration.js ./
COPY strapi-visibility-integration.js ./
COPY strapi-content-loader.js ./
COPY strapi-live-api*.js ./
COPY content-admin*.html ./

# Copy database files for export
COPY database*.sql ./

# Create directory for SQLite (development fallback)
RUN mkdir -p strapi-fresh/.tmp

# Expose port (Railway will override this with PORT env variable)
EXPOSE 8080

# Health check (uses PORT env variable, defaults to 8080 on Railway)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8080}/api/status || exit 1

# Start our custom server (NOT Strapi!)
CMD ["node", "server.js"]