<script setup lang="ts">
useHead({
  title: 'Playground',
})
</script>

<template>
  <UContainer class="px-4 py-8 sm:py-12">
    <h1 class="text-2xl font-semibold sm:text-3xl">
      This is a Playground, not a Product
    </h1>
    <p class="mt-4 max-w-prose text-pretty">
      The Playground Host proves Starter Nuxt Layers. Market Products are separate
      applications that extend those Layers.
    </p>
    <p class="mt-6">
      <UButton to="/register">
        Register
      </UButton>
    </p>
  </UContainer>
</template>
