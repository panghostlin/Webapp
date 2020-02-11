FROM node:12.14.1

RUN mkdir /home/app
WORKDIR /home/app

ADD package*.json ./
RUN yarn
ADD . .

# Building app
# RUN npm run build

# Running the app
# CMD ["npm", "start"]
CMD ["yarn", "run", "dev"]
EXPOSE 3000 49153