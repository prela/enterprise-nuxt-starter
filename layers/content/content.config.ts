import { join } from 'node:path'
import process from 'node:process'
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    // One collection for every Host that takes this Layer. There is no blog collection.
    docs: defineCollection({
      type: 'page',
      source: {
        include: 'docs/**/*.md',
        // Host-owned markdown under <Host>/content/docs. This Layer ships no articles.
        // Without cwd, Nuxt Content would look in this Layer’s content/ directory.
        cwd: join(process.cwd(), 'content'),
      },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
      }),
    }),
  },
})
