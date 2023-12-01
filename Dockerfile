#FROM node:16.3.0-alpine
FROM nginx:1.17.8-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY ./out /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY /nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]