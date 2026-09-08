<template>
  <div>
    <section class="border-b border-ink/10 bg-mist/40">
      <div class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p class="font-display text-sm font-semibold uppercase tracking-[0.22em] text-sea">
          Student area
        </p>
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Log in
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-muted-foreground">
          Fill in the form: your first name and preferred language are saved in a Pinia store,
          then the display updates based on your choice.
        </p>
      </div>
    </section>

    <section class="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
      <div>
        <h2 class="font-display text-2xl font-bold text-ink">
          {{ user.isConnected ? 'Update your profile' : 'Sign in' }}
        </h2>

        <form class="mt-6 space-y-5" @submit.prevent="onSubmit">
          <div>
            <label for="firstName" class="mb-1.5 block font-display text-sm font-semibold text-ink">
              First name
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              class="w-full border bg-white px-4 py-3 outline-none transition focus:border-sea focus:ring-2 focus:ring-sea/25"
              :class="fieldError.firstName ? 'border-destructive' : 'border-ink/20'"
              placeholder="e.g. David"
              @input="touched = true"
            >
          </div>

          <div>
            <label for="email" class="mb-1.5 block font-display text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full border bg-white px-4 py-3 outline-none transition focus:border-sea focus:ring-2 focus:ring-sea/25"
              :class="fieldError.email ? 'border-destructive' : 'border-ink/20'"
              placeholder="you@email.com"
              @input="touched = true"
            >
          </div>

          <div>
            <label for="language" class="mb-1.5 block font-display text-sm font-semibold text-ink">
              Preferred language
            </label>
            <select
              id="language"
              v-model="form.preferredLanguage"
              class="w-full border bg-white px-4 py-3 outline-none transition focus:border-sea focus:ring-2 focus:ring-sea/25"
              :class="fieldError.preferredLanguage ? 'border-destructive' : 'border-ink/20'"
              @change="onLanguagePreview"
            >
              <option value="" disabled>Choose a language</option>
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
              <option value="German">German</option>
            </select>
            <p class="mt-2 text-sm text-muted-foreground">
              This choice updates the preview on the right immediately (even before you submit).
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              type="submit"
              class="bg-sea px-6 py-3.5 font-display text-base font-semibold text-white transition hover:bg-ink"
            >
              {{ user.isConnected ? 'Update' : 'Log in' }}
            </button>
            <button
              v-if="user.isConnected"
              type="button"
              class="border border-ink/20 px-6 py-3.5 font-display text-base font-semibold text-ink transition hover:border-ink"
              @click="onDisconnect"
            >
              Log out
            </button>
          </div>
        </form>
      </div>

      <div class="space-y-6">
        <h2 class="font-display text-2xl font-bold text-ink">
          Dynamic display
        </h2>

        <UserEmptyState
          v-if="displayMode === 'empty'"
          title="Empty state"
          message="No profile logged in. Enter your first name and choose a language to reveal other components."
        />

        <UserInvalidState
          v-else-if="displayMode === 'invalid'"
          :errors="errors"
        />

        <template v-else>
          <UserWelcome :first-name="user.firstName" />
          <PreferenceShowcase :language="user.preferredLanguage" />
        </template>

        <div v-if="previewLanguage && displayMode !== 'connected'" class="pt-2">
          <p class="mb-3 font-display text-sm font-semibold text-ink">
            Preview for your current choice
          </p>
          <PreferenceShowcase :language="previewLanguage" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({ title: 'Log in — Horizons' })

const user = useUserStore()

const form = reactive({
  firstName: user.firstName || '',
  email: '',
  preferredLanguage: user.preferredLanguage || '',
})

const submitted = ref(false)
const touched = ref(false)
const previewLanguage = ref(user.preferredLanguage || '')

const errors = computed(() => {
  const list = []
  if (!form.firstName.trim()) {
    list.push('First name is required.')
  }
  else if (form.firstName.trim().length < 2) {
    list.push('First name must be at least 2 characters.')
  }
  if (!form.email.trim()) {
    list.push('Email is required.')
  }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    list.push('Email is not valid (e.g. you@email.com).')
  }
  if (!form.preferredLanguage) {
    list.push('Please choose a preferred language from the list.')
  }
  return list
})

const isValid = computed(() => errors.value.length === 0)

const fieldError = computed(() => ({
  firstName: submitted.value && (!form.firstName.trim() || form.firstName.trim().length < 2),
  email: submitted.value && (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())),
  preferredLanguage: submitted.value && !form.preferredLanguage,
}))

/** empty | invalid | connected */
const displayMode = computed(() => {
  if (user.isConnected) return 'connected'
  if (submitted.value && !isValid.value) return 'invalid'
  return 'empty'
})

function onLanguagePreview() {
  touched.value = true
  previewLanguage.value = form.preferredLanguage
}

function onSubmit() {
  submitted.value = true
  if (!isValid.value) return

  user.connect({
    firstName: form.firstName,
    preferredLanguage: form.preferredLanguage,
  })
  previewLanguage.value = form.preferredLanguage
}

function onDisconnect() {
  user.disconnect()
  submitted.value = false
  form.firstName = ''
  form.email = ''
  form.preferredLanguage = ''
  previewLanguage.value = ''
}
</script>
