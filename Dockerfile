FROM resin/rpi-node:0.10.22

COPY . /app

RUN apt-get update
RUN apt-get install sox
run cd /app && npm install

CMD ["node", "/app/index.js"]
