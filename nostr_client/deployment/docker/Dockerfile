FROM node:21.6-bookworm-slim as base
RUN apt update

FROM base as packages

RUN addgroup --system nostr_client \
    && adduser --system --ingroup nostr_client --disabled-password --uid 999 --home /home/nostr_client nostr_client \
    && chown -R nostr_client:nostr_client /home/nostr_client

WORKDIR /home/nostr_client

COPY --chown=nostr_client:nostr_client ./package.json ./yarn.lock ./tsconfig.json ./
COPY --chown=nostr_client:nostr_client ./src ./src
COPY --chown=nostr_client:nostr_client ./deployment/docker/entrypoint.sh ./entrypoint.sh

RUN yarn && \
    yarn tsc --noEmit

CMD ["./entrypoint.sh"]