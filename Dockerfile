FROM elixir:1.11.3-alpine AS build

RUN apk add --no-cache build-base yarn git python3

WORKDIR /app

RUN mix local.hex --force && \
    mix local.rebar --force

ENV MIX_ENV=prod

COPY mix.exs mix.lock ./
COPY config config
RUN mix do deps.get, deps.compile

COPY assets/package.json assets/yarn.lock assets/.yarnrc.yml ./assets/
COPY assets/.yarn ./assets/.yarn
RUN cd assets && yarn install

COPY priv priv
COPY assets assets
RUN cd assets && yarn build
RUN mix phx.digest

COPY lib lib

RUN mix do compile, release

FROM alpine:3.13.1 AS app
RUN apk add --no-cache openssl ncurses-libs

WORKDIR /app

RUN chown nobody:nobody /app

USER nobody:nobody

COPY --chown=nobody:nobody entrypoint.sh ./
COPY --from=build --chown=nobody:nobody /app/_build/prod/rel/shopping_elixir ./

ENV HOME=/app

CMD ["sh", "entrypoint.sh"]
