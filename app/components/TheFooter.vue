<template>
  <footer class="mt-auto border-t border-ink/10 bg-ink text-sand">
    <div class="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-8">
      <div>
        <p class="font-display text-2xl font-bold tracking-tight">Horizons</p>
        <p class="mt-2 max-w-sm text-sm text-sand/75">
          Language courses and linguistic stays — learn here, live the language abroad.
        </p>
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-2 font-display text-sm font-semibold">
        <NuxtLink to="/courses" class="transition hover:text-white">Courses</NuxtLink>
        <NuxtLink to="/trips" class="transition hover:text-white">Trips</NuxtLink>
        <NuxtLink :to="buildTripLink" class="transition hover:text-white">Build trip</NuxtLink>
        <NuxtLink v-if="user.isConnected" to="/my-trips" class="transition hover:text-white">My Trips</NuxtLink>
        <NuxtLink to="/about" class="transition hover:text-white">About</NuxtLink>
        <NuxtLink to="/contact" class="transition hover:text-white">Contact</NuxtLink>
        <NuxtLink to="/login" class="transition hover:text-white">Log in</NuxtLink>
      </div>
    </div>
    <div class="border-t border-white/10 px-5 py-4 text-center text-xs text-sand/55 md:px-8">
      © {{ year }} Horizons Language School — University project
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
const user = useUserStore()
const buildTripLink = computed(() => user.isConnected ? '/build-trip' : '/login?redirect=/build-trip')
</script>
