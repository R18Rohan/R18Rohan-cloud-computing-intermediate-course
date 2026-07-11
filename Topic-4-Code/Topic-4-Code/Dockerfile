# Stage 1: Build source files
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
RUN npm ci --no-audit --no-fund

COPY src/ ./src/
RUN npm run build

# Stage 2: Hardened Production runner
FROM node:18-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Security Hardening: Use non-root system users
USER node

COPY --chown=node:node package*.json ./
RUN npm ci --only=production --no-audit --no-fund

COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/dockerSecurityAuditor.js"]
