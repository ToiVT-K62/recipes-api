# ---- BUILD STAGE ----
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first (tận dụng cache)
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci

# Copy toàn bộ project
COPY . .

# Build cho production (tạo thư mục /app/build)
RUN npm run build

# ---- PRODUCTION STAGE ----
FROM node:20-alpine AS production

WORKDIR /app

# Copy output từ stage build
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Copy migration và cấu hình cần thiết
COPY database ./database
COPY start ./start
COPY .adonisrc.json .adonisrc.json
COPY ace-manifest.json ace-manifest.json
COPY .env.production .env

# Fly.io mount SQLite DB tại /app/tmp/database.sqlite
ENV DB_CONNECTION=sqlite
ENV SQLITE_DB_NAME=/app/tmp/database.sqlite
ENV HOST=0.0.0.0
ENV PORT=3333
ENV NODE_ENV=production

# Expose cổng HTTP của AdonisJS
EXPOSE 3333

# Chạy app
CMD ["node", "build/server.js"]
