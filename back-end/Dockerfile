FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .
COPY prisma ./prisma  

RUN npm install && npm install -g nodemon


RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
