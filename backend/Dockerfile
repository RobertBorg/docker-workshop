FROM mhart/alpine-node:11.9.0 as builder

COPY . ./
RUN yarn && yarn build

FROM mhart/alpine-node:11.9.0 as runtime

COPY package.json .
COPY yarn.lock .
COPY --from=builder ./dist/* ./dist/

RUN yarn install --production

EXPOSE 80

CMD node dist/main.bundle.js
