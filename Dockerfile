# Build build-container
FROM node:8-alpine as builder

COPY . /tmp/go-wiki-frontend

RUN set -ex \
  && apk -U --no-cache add \
    alpine-sdk \
    autoconf \
    automake \
    gettext \
    libpng-dev \
    libtool \
    nasm \
  && cd /tmp/go-wiki-frontend \
  && make clean all

FROM nginx:mainline-alpine

ARG BUILD_DATE
ARG VCS_REF

LABEL maintainer="Simon Erhardt <hello@rootlogin.ch>" \
  org.label-schema.name="Go-Wiki Frontend" \
  org.label-schema.description="Another wiki software written in Go." \
  org.label-schema.build-date=$BUILD_DATE \
  org.label-schema.vcs-ref=$VCS_REF \
  org.label-schema.vcs-url="https://github.com/chrootlogin/go-wiki-frontend" \
  org.label-schema.schema-version="1.0"

COPY --from=builder /tmp/go-wiki-frontend/dist /usr/share/nginx/html