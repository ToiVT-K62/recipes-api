#!/bin/sh
set -e

DB_FILE=/app/database/database.sqlite

# Tạo file SQLite nếu chưa tồn tại
if [ ! -f "$DB_FILE" ]; then
  echo "Tạo file SQLite..."
  touch "$DB_FILE"
fi

# Chạy migration (chỉ tạo bảng nếu chưa có)
echo "Chạy migration..."
node ace migration:run

# Start server
echo "Khởi động server..."
node build/bin/server.js
