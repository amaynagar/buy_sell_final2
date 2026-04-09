# Deployment Guide

## 1) Required GitHub Secrets

Add these repository secrets:

- `DOCKER_USERNAME`
- `DOCKER_TOKEN`

## 2) CI/CD Flow

Workflow file: `.github/workflows/ci-cd.yml`

On push to `main`, the pipeline will:

1. Install dependencies via `npm ci`
2. Run tests via `npm test`
3. Build Docker image
4. Push tags to DockerHub:
   - `latest`
   - `sha-<commit>`

## 3) DockerHub Image

The image name is:

`<DOCKER_USERNAME>/buy-sell`

## 4) Render Deployment

Use `render.yaml` with Docker runtime.

Set these environment variables in Render:

- `MONGO_URI`
- `NODE_ENV=production`

Render automatically provides `PORT`; the app reads `process.env.PORT`.

## 5) Run Locally With Docker Compose

```bash
docker compose up --build
```

This starts:

- `app` on `http://localhost:3000`
- `mongo` on `localhost:27017`
