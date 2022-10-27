#stage 1
FROM node:latest as node

WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build --prod --base-href=/wuebucal
#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/RubbishExport /usr/share/nginx/html
