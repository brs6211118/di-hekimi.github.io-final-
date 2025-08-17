FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY src ./src
COPY public ./public
COPY data ./data

# Create data directory and set permissions
RUN mkdir -p /app/data && chown -R node:node /app
USER node

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["npm", "start"]