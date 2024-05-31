FROM node:18

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .
RUN npm i --no-audit

COPY . .

CMD npm run start