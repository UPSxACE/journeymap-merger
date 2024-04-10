# Minecraft JourneyMap Merger

![version](https://img.shields.io/badge/version-v1.0.0--alpha-blue)

Minecraft JourneyMap Merger is a web application I created using NextJS and Golang, to merge the small pieces of the map from the famous minecraft mod 'JourneyMap' in one single image, so the user can enjoy zooming in and out as much as he wants. I deploy it with the help of Docker and Traefik reverse proxy.

<strong>THIS IS NOT A MINECRAFT MOD, ONLY A WEB APPLICATION</strong>

## Table of Contents

- [Development Prerequisites](#development-prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Deploy with Docker](#deploy-with-docker)

## Development Prerequisites

Ensure you have the following tools and dependencies installed on your system before diving into Linker development:

- Node & NPM
- Golang
- Makefil

## Installation and Setup

### Clone repository

```bash
git clone https://github.com/UPSxACE/journeymap-merger.git && cd journeymap-merger
```

### Install dependencies

```bash
cd ./web && npm install && cd ../ && cd ./api && go mod tidy && cd ../
```

### Create .env file in /api

```env
CORS_ORIGIN=http://localhost:3000
```

### Create .env.local file in /web

```env
NEXT_PUBLIC_MERGEAPI_URL=http://localhost:1323/api/merge
```

### Run the api and nextjs in development mode

```bash
# Cli Nº1
cd ./api && make dev
```

```bash
# Cli Nº2
cd ./web && npm run dev
```

## Deploy with Docker

### Clone repository

```bash
git clone https://github.com/UPSxACE/journeymap-merger.git && cd journeymap-merger
```

### Create .env file in the root of project

```env
# TRAEFIK
WEB_HOSTNAME=<DOMAIN USED FOR THE WEB APP>
CERTRESOLVER=<"staging" OR "production">
ACME_EMAIL=<EMAIL THAT WILL BE USED IN SSL CERTIFICATES>
# NEXTJS
# example: https://mydomain.com/api/merge
NEXT_PUBLIC_MERGEAPI_URL=<URL USED FOR THE WEB APP>/api/merge
NEXT_BUILD_STANDALONE=true
# API
CORS_ORIGIN=<URL USED FOR THE WEB APP>
```

### Create traefik network

```bash
docker network create traefik_network
```

### Build production compose container

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml build
```

### Run container

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```
