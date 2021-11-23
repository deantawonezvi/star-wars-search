FROM node:lts AS builder
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV HOST 0.0.0.0
ENV PORT 3000

EXPOSE 3000
CMD ["npm", "start"]
