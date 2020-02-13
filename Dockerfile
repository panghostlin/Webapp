FROM node:12.14.1

RUN mkdir /home/app
WORKDIR /home/app

COPY package*.json ./
RUN yarn
COPY . .

# Building app
# RUN npm run build

# Running the app
# CMD ["npm", "start"]
CMD ["yarn", "run", "dev"]
EXPOSE 3000 49153