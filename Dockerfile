# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN addgroup -S nodejs && adduser -S appuser -G nodejs
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]
