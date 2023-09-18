# Single-stage build
FROM node:16-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN SKIP_ENV_VALIDATION=true npm run build
EXPOSE 3000
ENV NODE_ENV production
CMD ["npm", "start"]
