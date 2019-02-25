FROM mhart/alpine-node:11.9.0

COPY . ./
RUN yarn && yarn build

EXPOSE 80

CMD node dist/main.bundle.js
