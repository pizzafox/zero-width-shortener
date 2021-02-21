FROM node:15.9.0-alpine3.10

WORKDIR /usr/src/app

ENV PORT=3000
EXPOSE 3000

COPY package.json yarn.lock .yarnrc.yml tsconfig.json ./
COPY prisma ./prisma
COPY .yarn ./.yarn
COPY src ./src

RUN yarn install --immutable
RUN yarn prisma generate
RUN yarn build

# Remove devDependencies manually, Yarn 2 doesn't support skipping them (see https://yarnpkg.com/configuration/manifest#devDependencies)
RUN yarn remove @semantic-release/exec @tsconfig/node14 @types/node @types/supports-color eslint-plugin-prettier prettier prettier-config-xo semantic-release ts-node type-fest typescript xo
RUN yarn install --immutable
RUN rm -rf .yarn/cache src tsconfig.json

CMD ["node", "."]
