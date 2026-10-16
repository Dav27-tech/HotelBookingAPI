FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY .sequelizerc.cjs ./
COPY src ./src

ENV NODE_ENV=production
CMD ["npm", "run", "start:docker"]
