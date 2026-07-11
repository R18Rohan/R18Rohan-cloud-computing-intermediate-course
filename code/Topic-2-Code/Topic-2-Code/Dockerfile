# Stage 1: Build and compile TypeScript source files
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
RUN npm ci --no-audit --no-fund

COPY src/ ./src/
RUN npm run build

# Stage 2: Production environment runner
FROM node:18-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund

# Copy compiled files from builder stage
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/containerDeployer.js"]
