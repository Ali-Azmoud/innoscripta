FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm config set fetch-retries 5
RUN npm config set fetch-timeout 60000
RUN npm config set registry https://registry.npmjs.org/

COPY . .

ENV NODE_ENV=development

EXPOSE 3000

CMD ["npm", "start"]
