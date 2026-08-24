<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

useHead({
  title: 'Error',
})

const heading = computed(() =>
  props.error.statusCode === 404 ? 'Page not found' : 'Something went wrong',
)
</script>

<template>
  <NuxtLayout name="error">
    <UContainer class="py-8 sm:py-12">
      <h1 class="text-2xl font-semibold sm:text-3xl">
        {{ heading }}
      </h1>
      <p class="mt-4 max-w-prose">
        That page is not available.
      </p>
      <UButton class="mt-6" to="/">
        Back to home
      </UButton>
    </UContainer>
  </NuxtLayout>
</template>
