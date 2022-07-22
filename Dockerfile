FROM node:12-alpine 
WORKDIR /usr/app
COPY . ./
COPY package*.json ./
RUN npm install --production
CMD ["npm", "start"]
