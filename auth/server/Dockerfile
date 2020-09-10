FROM node:latest

ENV SMTP_SERVER=mail.gandi.net
ENV SMPT_PORT=587
ENV SMTP_SECURE=false
ENV SMTP_USER=team@omo.earth
ENV SMTP_PASS=

ENV POSTGRES_CONNECTION_URL="postgresql://postgres:postgres@postgres:5432/omo-auth?schema=public"

ENV AUTH_SERVICE_BASE_URL=https://login.omo.earth
ENV AUTH_SERVICE_PORT=5000

ENV AUTH_SERVICE_JWT_ISSUER=https://login.omo.earth
ENV AUTH_SERVICE_JWT_EXP_IN_SEC=60
ENV AUTH_SERVICE_ROTATE_EVERY_N_SECONDS=300
ENV AUTH_SERVICE_GRAPHQL_SCHEMA=./omo-auth/auth/server/src/api/api-schema.graphql

RUN git clone https://github.com/omoearth/omo-auth.git
RUN cd omo-auth/auth && ./rebuild.sh

EXPOSE 5000/tcp

CMD ["node", "omo-auth/auth/server/dist/main.js"]
