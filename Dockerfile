FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY layers/core/package.json layers/core/package.json
COPY layers/ui/package.json layers/ui/package.json
COPY layers/identity/package.json layers/identity/package.json
COPY layers/seo/package.json layers/seo/package.json
RUN pnpm install --frozen-lockfile

COPY . .
# Build does not connect to Postgres; runtime env is injected by Compose.
ENV NUXT_PUBLIC_SITE_URL=http://localhost:3000
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.output .output
# Identity Drizzle migrations are applied at first register against PostgreSQL.
COPY --from=build /app/layers/identity/drizzle /app/layers/identity/drizzle
# Nitro already copies traced runtime modules into `.output/server/node_modules`.
# Its generated package.json also lists test toolchain (vitest, eslint, …). Feeding
# that manifest to npm 10.9.8 on node:22-alpine crashes arborist (`edgesOut`).
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
