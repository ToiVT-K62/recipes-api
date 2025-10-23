# Dockerfile for AdonisJS (SQLite + Fly.io)
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy rest of the project
COPY . .

# Build for production
RUN npm run build

# ---- Production image ----
FROM node:20-alpine AS production

WORKDIR /app

# Copy built files + node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Copy environment and database
COPY .env.production .env
COPY database ./database

# Expose port (Adonis default)
EXPOSE 3333

CMD ["node", "build/server.js"]
