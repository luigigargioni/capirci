
# # syntax = docker/dockerfile:1
# # This Dockerfile uses multi-stage build to customize DEV and PROD images:
# # https://docs.docker.com/develop/develop-images/multistage-build/

# # The base image we want to inherit from
# FROM python:3.10.6-slim AS development_build

# # `DJANGO_ENV` arg is used to make prod / dev builds:
# ARG DJANGO_ENV \
#     # Needed for fixing permissions of files created by Docker:
#     UID=1000 \
#     GID=1000

# ENV DJANGO_ENV=${DJANGO_ENV} \
#     # python:
#     PYTHONFAULTHANDLER=1 \
#     PYTHONUNBUFFERED=1 \
#     PYTHONHASHSEED=random \
#     PYTHONDONTWRITEBYTECODE=1 \
#     # pip:
#     PIP_NO_CACHE_DIR=off \
#     PIP_DISABLE_PIP_VERSION_CHECK=on \
#     PIP_DEFAULT_TIMEOUT=100 \
#     # poetry:
#     POETRY_VERSION=1.1.15 \
#     POETRY_NO_INTERACTION=1 \
#     POETRY_VIRTUALENVS_CREATE=false \
#     POETRY_CACHE_DIR='/var/cache/pypoetry' \
#     POETRY_HOME='/usr/local' \
#     # tini:
#     TINI_VERSION=v0.19.0 \
#     # dockerize:
#     DOCKERIZE_VERSION=v0.6.1

# SHELL ["/bin/bash", "-eo", "pipefail", "-c"]

# # System deps (we don't use exact versions because it is hard to update them,
# # pin when needed):
# # hadolint ignore=DL3008
# RUN apt-get update && apt-get upgrade -y \
#   && apt-get install --no-install-recommends -y \
#     bash \
#     brotli \
#     build-essential \
#     curl \
#     gettext \
#     git \
#     libpq-dev \
#   # Installing `dockerize` utility:
#   # https://github.com/jwilder/dockerize
#   && curl -sSLO "https://github.com/jwilder/dockerize/releases/download/${DOCKERIZE_VERSION}/dockerize-linux-amd64-${DOCKERIZE_VERSION}.tar.gz" \
#   && tar -C /usr/local/bin -xzvf "dockerize-linux-amd64-${DOCKERIZE_VERSION}.tar.gz" \
#   && rm "dockerize-linux-amd64-${DOCKERIZE_VERSION}.tar.gz" && dockerize --version \
#   # Installing `tini` utility:
#   # https://github.com/krallin/tini
#   # Get architecture to download appropriate tini release:
#   # See https://github.com/wemake-services/wemake-django-template/issues/1725
#   && dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')" \
#   && curl -o /usr/local/bin/tini -sSLO "https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-${dpkgArch}" \
#   && chmod +x /usr/local/bin/tini && tini --version \
#   # Installing `poetry` package manager:
#   # https://github.com/python-poetry/poetry
#   && curl -sSL 'https://install.python-poetry.org' | python - \
#   && poetry --version \
#   # Cleaning cache:
#   && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
#   && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# # set work directory
# WORKDIR /code

# RUN groupadd -g "${GID}" -r web \
#   && useradd -d '/code' -g web -l -r -u "${UID}" web \
#   && chown web:web -R '/code' \
#   # Static and media files:
#   && mkdir -p '/var/www/django/static' '/var/www/django/media' \
#   && chown web:web '/var/www/django/static' '/var/www/django/media'

# # Copy only requirements, to cache them in docker layer
# COPY --chown=web:web ./poetry.lock ./pyproject.toml /code/


# # Project initialization:
# # hadolint ignore=SC2046
# RUN --mount=type=cache,target="$POETRY_CACHE_DIR" \
#   echo "$DJANGO_ENV" \
#   && poetry version \
#   # Install deps:
#   && poetry run pip install -U pip \
#   && poetry install \
#     $(if [ "$DJANGO_ENV" = 'production' ]; then echo '--no-dev'; fi) \
#     --no-interaction --no-ansi

# # Running as non-root user:
# USER web

# # copy project
# COPY . /code

# # Run the project:
# CMD [ "poetry", "run", "python", "manage.py", "runserver" ]


FROM python:3.10.6-slim AS development_build

#ENV PIP_DISABLE_PIP_VERSION_CHECK=on
# `DJANGO_ENV` arg is used to make prod / dev builds:
ARG DJANGO_ENV
# Needed for fixing permissions of files created by Docker:
# UID=1000 \
# GID=1000

ENV DJANGO_ENV=${DJANGO_ENV} \
    # python:
    PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PYTHONDONTWRITEBYTECODE=1 \
    # pip:
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    # poetry:
    POETRY_VERSION=1.1.15 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_CACHE_DIR='/var/cache/pypoetry' \
    POETRY_HOME='/usr/local'

RUN pip install poetry

WORKDIR /app
COPY poetry.lock pyproject.toml /app/

# RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction

COPY . /app