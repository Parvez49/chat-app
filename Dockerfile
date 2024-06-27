FROM python:3.9-alpine3.13
LABEL maintainer="phcloud.com"

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt
COPY ./ProjectName /ProjectName
WORKDIR /ProjectName
EXPOSE 8000

ARG DEV=false
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apk add --update --no-cache postgresql-client && \
    apk add --update --no-cache --virtual .tmp-build-deps \
        build-base postgresql-dev musl-dev && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    if [ $DEV = "true" ]; \
        then /py/bin/pip install -r /tmp/requirements.dev.txt ; \
    fi && \
    rm -rf /tmp && \
    apk del .tmp-build-deps
    # && \
    # adduser \
    #     --disabled-password \
    #     --no-create-home \
    #     django-user



ENV PATH="/py/bin:$PATH"

#USER django-user



# # Create a non-root user and group with a specific UID/GID
# RUN addgroup -S usergroup && adduser -S user1 -G usergroup -u 1001
# RUN chown -R user1:usergroup /ProjectName/

# USER user1