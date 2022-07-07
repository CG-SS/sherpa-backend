FROM node:16.13.1

RUN mkdir -p /app/builder
WORKDIR /app/builder

RUN yarn global add nx && \
  yarn cache clean --all

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile --ignore-scripts && \
  yarn cache clean --all

# App env vars
ARG NODE_ENV
ARG DATABASE_URL
ARG PORT

# Kafka
ARG KAFKA_TOPIC
ARG KAFKA_GROUP_ID
ARG KAFKA_CLIENT_ID
ARG KAFKA_BROKERS

# App env vars
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

# Kafka
ENV KAFKA_TOPIC=${KAFKA_TOPIC}
ENV KAFKA_GROUP_ID=${KAFKA_GROUP_ID}
ENV KAFKA_CLIENT_ID=${KAFKA_CLIENT_ID}
ENV KAFKA_BROKERS=${KAFKA_BROKERS}

COPY . .

RUN yarn prisma:generate
RUN npx nx build services-events --prod --vendorChunk=false --commonChunk=false --parallel=3 && \
  yarn cache clean --all && \
  rm -rf /root/.cache/ && \
  rm -rf node_modules/.cache/

CMD ["sh", "-c", "yarn prisma:migrate:deploy && node /app/builder/dist/apps/services/events/main.js"]
