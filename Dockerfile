FROM alpine:3.6

ENV PHANTOMJS_VERSION=2.1.1

WORKDIR /srv/snap

COPY . .

RUN apk add -U \
        curl \
        git \
        nano \
        nodejs \
        nodejs-npm &&\
    curl -sL "https://github.com/dustinblackman/phantomized/releases/download/${PHANTOMJS_VERSION}/dockerized-phantomjs.tar.gz" | tar zx -C / && \
    npm install -g phantomjs && \
    npm cache clean && \
    rm -rf /var/cache/apk/* && \
    adduser -h /srv -s /bin/ash -D -u 4000 -g 4000 appuser && \
    chown -R appuser /srv && \
    su - appuser -c npm install

USER appuser

CMD node app

