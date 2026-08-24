FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY server ./server
COPY worker ./worker
COPY public ./public
EXPOSE 3030
CMD ["node", "server/server.js"]
