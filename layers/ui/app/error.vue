<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

useHead({
  title: 'Error',
})

// Heading and body must agree: a render failure is not a missing route.
const isNotFound = computed(() => props.error.statusCode === 404)
const heading = computed(() =>
  isNotFound.value ? 'Page not found' : 'Something went wrong',
)
const body = computed(() =>
  isNotFound.value
    ? 'That page is not available.'
    : 'The Playground could not render this page.',
)
</script>

<template>
  <NuxtLayout name="error">
    <UContainer class="py-8 sm:py-12">
      <h1 class="text-2xl font-semibold sm:text-3xl">
        {{ heading }}
      </h1>
      <p class="mt-4 max-w-prose">
        {{ body }}
      </p>
      <UButton class="mt-6" to="/">
        Back to home
      </UButton>
    </UContainer>
  </NuxtLayout>
</template>
