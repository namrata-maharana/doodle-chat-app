# Build stage
FROM node:22.16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_API_TOKEN
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_TOKEN=$VITE_API_TOKEN
RUN npm run build

# Production stage
FROM node:22.16-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g serve
USER node
EXPOSE 3000
COPY --from=builder --chown=node:node /app/dist ./dist
CMD ["serve", "-s", "dist", "-l", "3000"]
