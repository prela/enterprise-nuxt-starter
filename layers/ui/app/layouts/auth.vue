<script setup lang="ts">
// Chrome only; Identity pages own the form in the slot.
</script>

<template>
  <UApp>
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-default focus:px-3 focus:py-2"
    >
      Skip to main content
    </a>
    <div class="flex justify-end p-4">
      <UColorModeButton aria-label="Switch between light and dark mode" />
    </div>
    <!-- Identity screens own the form; this layout only supplies chrome and a centered region. -->
    <UMain
      id="main"
      tabindex="-1"
      class="flex min-h-[80vh] items-center justify-center px-4 py-8"
    >
      <slot />
    </UMain>
  </UApp>
</template>
