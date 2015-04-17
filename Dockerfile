FROM resin/rpi-node:0.10.22

COPY . /app

RUN apt-get update
RUN apt-get install -y sox
run cd /app && npm install

CMD sudo modprobe snd_bcm2835 && node /app/index.js
