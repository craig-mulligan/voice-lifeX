FROM resin/rpi-node:0.10.22

COPY . /app

RUN apt-get update
RUN apt-get install sox libsox-fmt-all
run cd /app && npm install

CMD ["node", "index.js"]
