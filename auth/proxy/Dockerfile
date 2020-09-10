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
RUN rm /etc/nginx/sites-enabled/default

RUN ./nginx.conf.sh

RUN cp ./nginx.conf /etc/nginx/sites-available/omo
RUN rm ./nginx.conf

RUN ln -s /etc/nginx/sites-available/omo /etc/nginx/sites-enabled/default

RUN openssl dhparam 2048 -out /etc/ssl/$DOMAIN.dhparams.pem

RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:certbot/certbot
RUN apt-get update
RUN apt-get install -y python-certbot-nginx

RUN certbot --non-interactive --agree-tos -m info@dbi-analytics.de --nginx -d ${droplet_name}
RUN certbot renew --dry-run
#RUN systemctl reload nginx
