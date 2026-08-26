<script setup lang="ts">
// Default UI chrome (not auth, not an admin layout). The route is gated by Identity middleware.
useHead({
  title: 'Protected',
})

const pending = ref(false)

async function onLogout() {
  pending.value = true
  const { $csrfFetch } = useNuxtApp()
  try {
    await $csrfFetch('/api/identity/logout', {
      method: 'POST',
    })
    await navigateTo('/')
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <UContainer class="px-4 py-8 sm:py-12">
    <h1 class="text-2xl font-semibold sm:text-3xl">
      Protected page
    </h1>
    <p class="mt-4 max-w-prose text-pretty">
      Identity is working.
    </p>
    <!-- Native form so a member can end the session without a client-only control. -->
    <form
      class="mt-6"
      method="post"
      action="/api/identity/logout"
      @submit.prevent="onLogout"
    >
      <UButton
        type="submit"
        variant="outline"
        :loading="pending"
      >
        Log out
      </UButton>
    </form>
  </UContainer>
</template>
