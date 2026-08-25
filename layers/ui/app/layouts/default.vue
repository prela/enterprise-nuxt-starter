<script setup lang="ts">
const { starter } = useAppConfig()
</script>

<template>
  <UApp>
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-default focus:px-3 focus:py-2"
    >
      Skip to main content
    </a>
    <!-- No extra nav: home is the only shipped screen; an empty mobile menu would fail a11y. -->
    <UHeader :title="starter.chromeTitle" to="/" :toggle="false">
      <template #right>
        <UColorModeButton aria-label="Switch between light and dark mode" />
      </template>
    </UHeader>
    <UMain id="main" tabindex="-1">
      <slot />
    </UMain>
  </UApp>
</template>
