# Docker Setup Guide — The Kinetic Ledger

## Prerequisites

1. Install Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Open Docker Desktop and make sure it's running (whale icon in menu bar)
3. Verify in terminal: `docker --version`

---

## Step 1: Create the Dockerfile

Create a file called `Dockerfile` (no extension) in the project root (`the-kinetic-ledger/Dockerfile`).

```dockerfile
# --- Stage 1: Install dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Stage 2: Build the app ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass build-time env variables
ARG YOUTUBE_API_KEY
ENV YOUTUBE_API_KEY=$YOUTUBE_API_KEY

RUN npm run build

# --- Stage 3: Production image ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### What each stage does:

- **Stage 1 (deps)**: installs node_modules in an isolated layer — cached unless package.json changes
- **Stage 2 (builder)**: copies your code + node_modules, runs `npm run build`
- **Stage 3 (runner)**: tiny final image with only production files, no dev dependencies

This is a **multi-stage build** — the final image is small (~150MB vs ~1GB if you copied everything).

---

## Step 2: Enable standalone output

Open `next.config.ts` and add the `output` option:

```ts
const nextConfig = {
  output: "standalone",
  // ...your existing config
}
```

This tells Next.js to create a self-contained build that includes only the files needed to run — perfect for Docker.

---

## Step 3: Create .dockerignore

Create a `.dockerignore` file in the project root. This prevents unnecessary files from being copied into the image:

```
node_modules
.next
.git
.gitignore
*.md
.env*.local
.DS_Store
```

---

## Step 4: Build the image

From the `the-kinetic-ledger/` directory:

```bash
docker build \
  --build-arg YOUTUBE_API_KEY=your_actual_key_here \
  -t kinetic-ledger .
```

- `--build-arg` passes your API key at build time (needed for `npm run build`)
- `-t kinetic-ledger` tags/names the image
- `.` means "use the Dockerfile in the current directory"

This will take a few minutes the first time. Subsequent builds are faster due to layer caching.

---

## Step 5: Run the container

```bash
docker run -p 3000:3000 --env-file .env.local kinetic-ledger
```

- `-p 3000:3000` maps your machine's port 3000 to the container's port 3000
- `--env-file .env.local` passes your environment variables to the running container
- Open http://localhost:3000 — your app is running in Docker!

---

## Step 6: Useful commands

```bash
# List running containers
docker ps

# Stop a container
docker stop <container_id>

# List all images
docker images

# Remove an image
docker rmi kinetic-ledger

# See container logs
docker logs <container_id>

# Shell into a running container (for debugging)
docker exec -it <container_id> sh

# Rebuild without cache (if something is stuck)
docker build --no-cache -t kinetic-ledger .
```

---

## Troubleshooting

**"Cannot connect to the Docker daemon"**
→ Docker Desktop is not running. Open it.

**Build fails at `npm run build`**
→ Check if your env variables are passed correctly with `--build-arg`

**App starts but pages show errors**
→ Check logs with `docker logs <container_id>`. Likely a missing env variable — make sure `.env.local` has all your keys.

**Port already in use**
→ Either stop the other process on port 3000, or map to a different port: `docker run -p 3001:3000 kinetic-ledger`

---

## Next steps (after this works)

- **Stage 2**: Deploy this image to AWS EC2
- **Stage 3**: Push to AWS ECR + run on ECS Fargate
- **Stage 4**: Automate with GitHub Actions CI/CD

Guides for those will come later.
