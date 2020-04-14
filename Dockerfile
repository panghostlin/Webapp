FROM node:12.14.1

RUN mkdir /home/app
WORKDIR /home/app

COPY package*.json ./
RUN yarn
COPY . .

RUN export IS_DEV=$IS_DEV
CMD ["sh", "start.sh"]

EXPOSE 3000 49153