FROM node:12-alpine 
WORKDIR /usr/app
COPY . ./
COPY package*.json ./
RUN npm install --production
EXPOSE 8443
CMD ["npm", "start"]
