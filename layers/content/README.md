# Content Nuxt Layer — Public Layer interface

Products may depend on `@starter/content` only through this interface. A Product may omit this Layer entirely.

## Extend

```ts
export default defineNuxtConfig({
  extends: ['@starter/content'],
})
```

Do not import files under `layers/content/` (Tiers). Those paths are not public. There is no wrapper composable (`useDocs` is not this interface).

This Layer does not `extends` i18n, seo, Identity, or UI. The Host composes catalogue Layers.

## `docs` collection

The Layer owns the `docs` Zod schema. Markdown files live in the Host (`content/docs/**/*.md`). Extending this Layer does not ship articles into a Product.

There is no `blog` collection.

| Field | Required | Meaning |
| --- | --- | --- |
| `title` | yes | Page title. Also a page-type field used by navigation. |
| `description` | no | Short summary for listings and surroundings. |

## Read path

Query with Nuxt Content APIs. Do not wrap them until a Product needs a Public Layer composable.

| API | Use |
| --- | --- |
| `queryCollection('docs')` | One page or a filtered list. |
| `queryCollectionNavigation('docs')` | Navigation tree. |
| `queryCollectionItemSurroundings('docs', path)` | Previous and next siblings. |

## Runtime

The Layer indexes markdown with SQLite via Node 22 `node:sqlite`. Hosts on another runtime may set `content.experimental.sqliteConnector`. Content does not add a PostgreSQL schema; Core still owns the database URL.
