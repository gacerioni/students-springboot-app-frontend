FROM nginx
LABEL maintainer="Gabriel Cerioni <gacerioni@gmail.com>"

EXPOSE 8080

COPY build /usr/share/nginx/html