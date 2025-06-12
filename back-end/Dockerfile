FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install && npm install -g nodemon

COPY . .

EXPOSE 3000

# Comando padrão (modo dev com nodemon, ou use npm start em prod)
CMD ["npm", "run", "dev"]
