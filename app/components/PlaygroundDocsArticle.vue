<script setup lang="ts">
// Host-owned docs article. Queries the Content Layer’s docs collection — no useDocs wrapper.
const props = defineProps<{
  docsRoute: string
}>()

const { locale } = useI18n()
const localePath = useLocalePath()

function docsContentPath(docsRoute: string, localeCode: string) {
  if (localeCode === 'en')
    return docsRoute
  // Suffix convention: index.hr.md is not a directory index, so `/docs` maps to `/docs/index.hr`.
  if (docsRoute === '/docs')
    return `/docs/index.${localeCode}`
  return `${docsRoute}.${localeCode}`
}

function isLocaleDocsPath(itemPath: string, localeCode: string) {
  if (localeCode === 'en')
    return !/\.[a-z]{2}$/.test(itemPath)
  return itemPath.endsWith(`.${localeCode}`)
}

function docsHref(itemPath: string) {
  return itemPath
    .replace(/\/index\.[a-z]{2}$/, '')
    .replace(/\.[a-z]{2}$/, '') || '/docs'
}

function flattenDocsNav(items: { path: string, title?: string, children?: unknown[] }[] | undefined): { path: string, title?: string }[] {
  return (items ?? []).flatMap((item) => {
    const children = Array.isArray(item.children)
      ? flattenDocsNav(item.children as { path: string, title?: string, children?: unknown[] }[])
      : []
    return item.path ? [item, ...children] : children
  })
}

interface DocsPage {
  path: string
  title: string
  description?: string
}

const contentPath = computed(() => docsContentPath(props.docsRoute, locale.value))

// Collection name is the Content Layer contract. Host vue-tsc can miss Layer-generated Collections.
function docsCollection() {
  return queryCollection('docs' as never)
}

const { data: page } = await useAsyncData(
  () => `docs-page-${locale.value}-${contentPath.value}`,
  async () => await docsCollection().path(contentPath.value).first() as DocsPage | null,
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { data: navigation } = await useAsyncData(
  () => `docs-navigation-${locale.value}`,
  async () => {
    const tree = await queryCollectionNavigation('docs' as never)
    return flattenDocsNav(tree).filter(item => isLocaleDocsPath(item.path, locale.value))
  },
)

const { data: surroundings } = await useAsyncData(
  () => `docs-surroundings-${locale.value}-${contentPath.value}`,
  async () => {
    const items = await queryCollectionItemSurroundings('docs' as never, contentPath.value)
    return (items ?? []).filter(item => item && isLocaleDocsPath(item.path, locale.value))
  },
)

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogDescription: page.value.description,
})
</script>

<template>
  <UContainer class="px-4 py-8 sm:py-12">
    <div class="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <nav
        class="text-sm"
        aria-label="Docs"
      >
        <ul class="flex flex-col gap-2">
          <li
            v-for="item in navigation"
            :key="item.path"
          >
            <NuxtLink :to="localePath(docsHref(item.path))">
              {{ item.title }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <div>
        <article v-if="page">
          <h1 class="text-2xl font-semibold sm:text-3xl">
            {{ page.title }}
          </h1>
          <ContentRenderer
            class="mt-4 max-w-prose text-pretty"
            :value="page"
          />
        </article>
        <nav
          v-if="surroundings?.length"
          class="mt-8 flex flex-wrap gap-4 text-sm"
          aria-label="Surroundings"
        >
          <NuxtLink
            v-for="item in surroundings.filter(Boolean)"
            :key="item.path"
            :to="localePath(docsHref(item.path))"
          >
            {{ item.title }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </UContainer>
</template>
