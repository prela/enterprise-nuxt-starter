<script setup lang="ts">
// Thin route wrapper. Remount on full path so each docs URL re-runs Content queries.
definePageMeta({
  key: route => route.fullPath,
})

const route = useRoute()
const { locale } = useI18n()

const docsRoute = computed(() => {
  if (locale.value === 'en')
    return route.path
  return route.path.replace(new RegExp(`^/${locale.value}(?=/|$)`), '') || '/docs'
})
</script>

<template>
  <PlaygroundDocsArticle
    :key="docsRoute"
    :docs-route="docsRoute"
  />
</template>
