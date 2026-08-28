<script setup lang="ts">
// Chrome lives in the UI Layer auth layout. Register rules live in Identity application services.
definePageMeta({
  layout: 'auth',
})

useHead({
  title: 'Register',
})

const email = ref('')
const password = ref('')
const fieldErrors = ref<{ email?: string, password?: string }>({})
const formError = ref('')
const pending = ref(false)

async function onSubmit() {
  fieldErrors.value = {}
  formError.value = ''
  pending.value = true
  const { $csrfFetch } = useNuxtApp()
  try {
    await $csrfFetch('/api/identity/register', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    await navigateTo('/')
  }
  catch (error) {
    const data = (error as { data?: { error?: { code?: string, fields?: { email?: string, password?: string } } } }).data
    if (data?.error?.code === 'validation')
      fieldErrors.value = data.error.fields ?? {}
    else if (data?.error?.code === 'duplicate-email')
      formError.value = 'That email is already registered'
    else
      formError.value = 'Registration failed'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    <h1 class="text-2xl font-semibold">
      Register
    </h1>
    <p class="mt-2 text-pretty text-muted">
      Create a Playground membership with email and password.
    </p>
    <!-- Native form so the first paint is real HTML, not an empty client shell. -->
    <form
      class="mt-6 flex flex-col gap-4"
      method="post"
      action="/api/identity/register"
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
        :error="fieldErrors.email"
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
        hint="At least 8 characters"
        :error="fieldErrors.password"
      >
        <UInput
          id="password"
          v-model="password"
          name="password"
          type="password"
          autocomplete="new-password"
          required
        />
      </UFormField>
      <UButton
        type="submit"
        block
        :loading="pending"
      >
        Register
      </UButton>
    </form>
  </div>
</template>
