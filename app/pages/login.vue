<template>
  <div>
    <section class="border-b border-ink/10 bg-mist/40">
      <div class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p class="font-display text-sm font-semibold uppercase tracking-[0.22em] text-sea">
          Account
        </p>
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Sign up / Log in
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-muted-foreground">
          Create your Horizons account, then build and save your language trip.
        </p>
      </div>
    </section>

    <section class="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
      <div>
        <h2 class="font-display text-2xl font-bold text-ink">
          {{ user.isConnected ? 'You are connected' : 'Connect to continue' }}
        </h2>

        <div
          v-if="!user.isConnected"
          class="mt-6 flex flex-wrap gap-2"
        >
          <button
            type="button"
            class="border px-4 py-2 font-display text-sm font-semibold transition"
            :class="mode === 'login'
              ? 'border-sea bg-sea text-white'
              : 'border-ink/20 bg-white text-ink hover:border-sea'"
            @click="mode = 'login'"
          >
            Log in
          </button>
          <button
            type="button"
            class="border px-4 py-2 font-display text-sm font-semibold transition"
            :class="mode === 'signup'
              ? 'border-sea bg-sea text-white'
              : 'border-ink/20 bg-white text-ink hover:border-sea'"
            @click="mode = 'signup'"
          >
            Sign up
          </button>
        </div>

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
              autocomplete="given-name"
            >
          </div>

          <div>
            <label for="email" class="mb-1.5 block font-display text-sm font-semibold text-ink">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full border bg-white px-4 py-3 outline-none transition focus:border-sea focus:ring-2 focus:ring-sea/25"
              :class="fieldError.email ? 'border-destructive' : 'border-ink/20'"
              placeholder="you@email.com"
              autocomplete="email"
            >
          </div>

          <div>
            <label for="password" class="mb-1.5 block font-display text-sm font-semibold text-ink">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="w-full border bg-white px-4 py-3 outline-none transition focus:border-sea focus:ring-2 focus:ring-sea/25"
              :class="fieldError.password ? 'border-destructive' : 'border-ink/20'"
              placeholder="At least 6 characters"
              :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'"
            >
          </div>

          <p
            v-if="authMessage"
            class="border border-sea/30 bg-sea/5 px-4 py-3 text-sm text-sea"
          >
            {{ authMessage }}
          </p>

          <div class="flex flex-wrap gap-3">
            <button
              type="submit"
              class="bg-sea px-6 py-3.5 font-display text-base font-semibold text-white transition hover:bg-ink disabled:opacity-60"
              :disabled="isLoading"
            >
              <template v-if="isLoading">
                Please wait…
              </template>
              <template v-else-if="user.isConnected">
                Continue
              </template>
              <template v-else>
                {{ mode === 'signup' ? 'Create account' : 'Log in' }}
              </template>
            </button>
            <button
              v-if="user.isConnected"
              type="button"
              class="border border-ink/20 px-6 py-3.5 font-display text-base font-semibold text-ink transition hover:border-ink"
              :disabled="isLoading"
              @click="onDisconnect"
            >
              Log out
            </button>
          </div>
        </form>
      </div>

      <div class="space-y-6">
        <h2 class="font-display text-2xl font-bold text-ink">
          Next step
        </h2>

        <UserEmptyState
          v-if="displayMode === 'empty'"
          title="Empty state"
          message="Enter your first name, email and password to unlock Build Your Language Trip."
        />

        <UserInvalidState
          v-else-if="displayMode === 'invalid'"
          :errors="errors"
        />

        <template v-else>
          <div class="border border-sea/30 bg-sea/10 px-6 py-8">
            <p class="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sea">
              Connected
            </p>
            <h2 class="mt-2 font-display text-3xl font-bold text-ink">
              <template v-if="user.displayName">
                Hello, {{ user.displayName }}!
              </template>
              <template v-else>
                Hello!
              </template>
            </h2>
            <p class="mt-3 text-muted-foreground">
              You’re ready. Build your personalized language trip next.
            </p>
            <NuxtLink
              :to="redirectPath"
              class="mt-6 inline-flex bg-sea px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-ink"
            >
              Build Your Trip
            </NuxtLink>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({ title: 'Sign up / Log in — Horizons' })

const user = useUserStore()
const trip = useTripBuilderStore()
const route = useRoute()
const router = useRouter()

const mode = ref('login')
const isLoading = ref(false)
const submitted = ref(false)
const authMessage = ref('')
const serverErrors = ref([])

const form = reactive({
  firstName: user.firstName || '',
  email: '',
  password: '',
})

const redirectPath = computed(() =>
  typeof route.query.redirect === 'string' ? route.query.redirect : '/build-trip',
)

const errors = computed(() => {
  const list = [...serverErrors.value]
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
  if (!form.password.trim()) {
    list.push('Password is required.')
  }
  else if (form.password.trim().length < 6) {
    list.push('Password must be at least 6 characters.')
  }
  return list
})

const isValid = computed(() => {
  const local = []
  if (!form.firstName.trim() || form.firstName.trim().length < 2) local.push('First name')
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) local.push('Email')
  if (!form.password.trim() || form.password.trim().length < 6) local.push('Password')
  return local.length === 0
})

const fieldError = computed(() => ({
  firstName: submitted.value && (!form.firstName.trim() || form.firstName.trim().length < 2),
  email: submitted.value && (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())),
  password: submitted.value && (!form.password.trim() || form.password.trim().length < 6),
}))

const displayMode = computed(() => {
  if (user.isConnected) return 'connected'
  if (submitted.value && (!isValid.value || serverErrors.value.length)) return 'invalid'
  return 'empty'
})

async function onSubmit() {
  submitted.value = true
  serverErrors.value = []
  authMessage.value = ''
  if (!isValid.value) return

  if (user.isConnected) {
    await router.push(redirectPath.value)
    return
  }

  isLoading.value = true

  if (mode.value === 'signup') {
    const { data, error } = await user.signUp({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
    })

    if (error) {
      serverErrors.value = [error.message]
      isLoading.value = false
      return
    }

    if (!data.session) {
      authMessage.value = 'Account created. Check your email to confirm, then log in.'
      mode.value = 'login'
      isLoading.value = false
      return
    }
  }
  else {
    const { error } = await user.signIn({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
    })

    if (error) {
      serverErrors.value = [error.message]
      isLoading.value = false
      return
    }
  }

  await trip.loadFromDatabase()
  isLoading.value = false
  form.password = ''
  await router.push(redirectPath.value)
}

async function onDisconnect() {
  isLoading.value = true
  serverErrors.value = []
  authMessage.value = ''
  const { error } = await user.disconnect()
  isLoading.value = false
  submitted.value = false
  form.firstName = ''
  form.email = ''
  form.password = ''
  if (error) {
    serverErrors.value = [error.message]
  }
}

onMounted(async () => {
  if (user.isConnected) {
    await user.loadProfile()
    if (user.firstName) form.firstName = user.firstName
  }
})
</script>
