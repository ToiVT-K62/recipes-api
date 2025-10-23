# ---- BUILD IMAGE ----
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files và cài dependencies
COPY package*.json ./
RUN npm ci

# Copy toàn bộ code
COPY . .

# Build cho production (adonis 6)
RUN npm run build

# ---- PRODUCTION IMAGE ----
FROM node:20-alpine AS production
WORKDIR /app

# Copy build và các file cần thiết
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/.adonisrc.json .adonisrc.json
COPY --from=build /app/config ./config
COPY --from=build /app/start ./start
COPY --from=build /app/.env.production .env

# Cổng mặc định AdonisJS
EXPOSE 3333

# Lệnh khởi chạy production (Adonis 6)
CMD ["node", "build/bin/server.js"]
