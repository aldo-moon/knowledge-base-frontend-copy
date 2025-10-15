# Imagen base
FROM node:18.18.0

# Carpeta de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Build de la aplicación Next.js 
RUN npm run build -- --no-lint

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la app
CMD ["npm", "start"]