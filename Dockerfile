FROM resin/rpi-node:0.10.22

COPY . /app

RUN npm install && apt-get install sox

CMD ["node", "index.js"]
