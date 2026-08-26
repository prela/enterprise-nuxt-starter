<script setup lang="ts">
// Chrome lives in the UI Layer auth layout. Login rules live in Identity application services.
definePageMeta({
  layout: 'auth',
})

useHead({
  title: 'Log in',
})

const email = ref('')
const password = ref('')
const formError = ref('')
const pending = ref(false)
const signedInEmail = useState('identity-signed-in-email', () => {
  const principal = useRequestEvent()?.context.identityPrincipal as { email?: string } | undefined
  return principal?.email ?? ''
})

async function onSubmit() {
  formError.value = ''
  pending.value = true
  const { $csrfFetch } = useNuxtApp()
  try {
    await $csrfFetch('/api/identity/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    await navigateTo('/')
  }
  catch {
    // Same copy for unknown email and wrong password: the port does not enumerate.
    formError.value = 'Invalid email or password'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    <h1 class="text-2xl font-semibold">
      Log in
    </h1>
    <p class="mt-2 text-pretty text-muted">
      Sign in to the Playground with email and password.
    </p>
    <p
      v-if="signedInEmail"
      class="mt-2 text-sm"
    >
      Signed in as {{ signedInEmail }}
    </p>
    <!-- Native form so the first paint is real HTML, not an empty client shell. -->
    <form
      class="mt-6 flex flex-col gap-4"
      method="post"
      action="/api/identity/login"
      @submit.prevent="onSubmit"
    >
      <p
        v-if="formError"
        class="text-sm text-error"
        role="alert"
      >
        {{ formError }}
      </p>
      <UFormField
        label="Email"
        name="email"
      >
        <UInput
          id="email"
          v-model="email"
          name="email"
          type="email"
          autocomplete="email"
          required
        />
      </UFormField>
      <UFormField
        label="Password"
        name="password"
      >
        <UInput
          id="password"
          v-model="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </UFormField>
      <UButton
        type="submit"
        block
        :loading="pending"
      >
        Log in
      </UButton>
    </form>
  </div>
</template>
