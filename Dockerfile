# ---- BUILD IMAGE ----
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files & cài dependencies
COPY package*.json ./
RUN npm ci

# Copy toàn bộ code & tạo folder database
COPY . .
RUN mkdir -p /app/database

# Build AdonisJS production
RUN npm run build


# ---- PRODUCTION IMAGE ----
FROM node:20-alpine AS production
WORKDIR /app

RUN apk add --no-cache sqlite

# Copy build + node_modules + config + env
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/config ./config
COPY --from=build /app/start ./start
COPY --from=build /app/.env.production .env
COPY --from=build /app/database ./database
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
# Tạo thư mục database (Fly.io volume mount)
RUN mkdir -p /app/database

# Expose port
EXPOSE 3333

CMD ["/entrypoint.sh"]

