# Стъпка 1: Изграждане на приложението (Build Stage)
FROM node:22.22.3-alpine AS build
WORKDIR /app

# Копиране на конфигурационните файлове
COPY package*.json ./

# Инсталиране на зависимостите (включително devDependencies за билда)
RUN npm ci

# Копиране на сорс кода
COPY . .

# Компилиране на Angular SSR
RUN npm run build

# Стъпка 2: Стартиране на производствената среда (Production Stage)
FROM node:22.22.3-alpine AS runtime
WORKDIR /app

# Копиране само на компилирания проект от предишната стъпка
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Инсталиране само на производствените зависимости (dependencies) за по-малък имидж
RUN npm ci --only=production

# Експортиране на порта (Angular SSR по подразбиране често слуша на 4000 или Порт от средата)
EXPOSE 4000

# Стартиране на Express сървъра (името на скрипта от вашия package.json)
CMD ["npm", "run", "serve:ssr:DentistAppointments"]