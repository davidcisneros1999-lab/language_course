<template>
  <header
    class="sticky top-0 z-50 border-b border-ink/10 bg-background/85 backdrop-blur-md"
  >
    <nav class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
      <NuxtLink
        to="/"
        class="font-display text-xl font-bold tracking-tight text-ink transition hover:text-sea md:text-2xl"
      >
        Horizons
      </NuxtLink>

      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-md border border-ink/15 md:hidden"
        :aria-expanded="open"
        aria-label="Toggle menu"
        @click="open = !open"
      >
        <span class="sr-only">Menu</span>
        <svg v-if="!open" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <ul
        class="absolute left-0 right-0 top-full flex-col gap-1 border-b border-ink/10 bg-background px-5 py-4 md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0"
        :class="open ? 'flex' : 'hidden md:flex'"
      >
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="block py-2 font-display text-sm font-semibold text-ink/75 transition hover:text-sea md:py-0"
            exact-active-class="!text-sea"
            @click="open = false"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
        <li class="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <span
            v-if="user.isConnected"
            class="font-display text-sm font-semibold text-sea"
          >
            Hello, {{ user.firstName }}
          </span>
          <NuxtLink
            to="/login"
            class="mt-2 inline-flex items-center justify-center bg-sea px-4 py-2 font-display text-sm font-semibold text-primary-foreground transition hover:bg-ink md:mt-0"
            @click="open = false"
          >
            {{ user.isConnected ? 'My profile' : 'Log in' }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
const open = ref(false)
const route = useRoute()
const user = useUserStore()

watch(() => route.path, () => {
  open.value = false
})

const links = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Language Courses' },
  { to: '/trips', label: 'Language Trips' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]
</script>
