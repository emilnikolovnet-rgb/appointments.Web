#git Стъпка 1: Изграждане на приложението (Build Stage)
FROM node:22.22.3-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# Стъпка 2: Стартиране на производствената среда (Production Stage)
FROM node:22.22.3-alpine AS runtime
WORKDIR /app

# Копираме САМО компилирания проект от предишната стъпка
COPY --from=build /app/dist ./dist

# ВАЖНО: Новият Application Builder генерира вграден сървър в dist/DentistAppointments/server/
# Затова в runtime етапа НЕ ви е нужен package.json или повторно npm ci --only=production!
# Цялата логика и зависимост на сървъра вече са пакетирани там от Angular.

# Експортиране на порта за Azure Container Apps
EXPOSE 4000
ENV PORT=4000
ENV NODE_ENV=production

# СТАРТИРАНЕ: Извикваме Node директно към генерирания сървърен файл,
# което премахва проблема с "Header host is not allowed".
CMD ["node", "dist/DentistAppointments/server/server.mjs"]