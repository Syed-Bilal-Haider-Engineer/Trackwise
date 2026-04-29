FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++ curl

FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS final
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p /app/data /app/uploads

EXPOSE 4000
CMD ["node", "src/index.js"]
