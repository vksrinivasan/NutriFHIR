FROM node:6
WORKDIR /app
COPY . /app
RUN npm install popper.js@^1.12.9
RUN npm install nodemon -g --save
RUN npm install
CMD npm start
EXPOSE 6001