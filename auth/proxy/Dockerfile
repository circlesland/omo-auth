FROM ubuntu

ARG DOMAIN
ENV DOMAIN=$DOMAIN

ARG IPV4ADDRESS
ENV IPV4ADDRESS=$IPV4ADDRESS

COPY ./nginx.conf.sh .
RUN chmod +x ./nginx.conf.sh

RUN apt-get update
RUN apt-get install -y nginx
RUN apt-get install -y openssl
RUN apt-get install -y certbot python3-certbot-nginx

RUN rm /etc/nginx/sites-enabled/default
RUN ./nginx.conf.sh
RUN cp ./nginx.conf /etc/nginx/sites-available/omo
RUN rm ./nginx.conf
RUN ln -s /etc/nginx/sites-available/omo /etc/nginx/sites-enabled/default

RUN openssl dhparam 2048 -out /etc/ssl/$DOMAIN.dhparams.pem

RUN certbot --non-interactive --agree-tos --nginx -d ${DOMAIN} -d www.${DOMAIN}
RUN certbot renew --dry-run

