<script setup lang="ts">
// Default UI chrome (not auth, not an admin layout). The route is gated by Identity middleware.
useHead({
  title: 'Protected',
})
</script>

<template>
  <UContainer class="px-4 py-8 sm:py-12">
    <h1 class="text-2xl font-semibold sm:text-3xl">
      Protected page
    </h1>
    <p class="mt-4 max-w-prose text-pretty">
      Identity is working.
    </p>
  </UContainer>
</template>
