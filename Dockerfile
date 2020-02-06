# build environment
FROM node:12-alpine as builder

ARG API_URL

ENV PATH /app/node_modules/.bin:$PATH
ENV REACT_APP_API_URL=${API_URL}

RUN echo "API_URL: ${REACT_APP_API_URL}"

WORKDIR /app

COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@3.3.0 -g --silent

COPY . /app
RUN npm run build

# production environment
FROM nginx:1.17-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
