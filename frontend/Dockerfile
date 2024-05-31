FROM node:18

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .
RUN npm i --no-audit --force

COPY . .

EXPOSE 3000

CMD npm run start 
