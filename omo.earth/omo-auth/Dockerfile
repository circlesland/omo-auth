FROM node:latest

RUN git clone https://github.com/omoearth/omo-auth.git
RUN cd omo-auth/auth && ./rebuild.sh

CMD ["node", "omo-auth/auth/server/dist/main.js"]
