# --- Build Stage ---
FROM node:20-alpine AS builder

# рабочая директория
WORKDIR /app

# копируем файлы с зависимостями
COPY package.json package-lock.json ./

# устанавливаем все зависимости (включая dev)
RUN npm ci

# копируем исходники
COPY . .

# билдим приложение в standalone-режиме
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

# копируем public (статичные файлы пользователя)
COPY --from=builder /app/public ./public

# копируем standalone-пакет (включает server.js, package.json и node_modules)
COPY --from=builder /app/.next/standalone ./

# копируем автоматом собранные статичные ассеты
COPY --from=builder /app/.next/static ./.next/static

# по желанию: выставляем порт
EXPOSE 3000

# запускаем сервер
CMD ["node", "server.js"]
