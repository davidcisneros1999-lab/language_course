<template>
  <div>
    <!-- Hero: one composition — brand, slogan, CTA, full-bleed image -->
    <section class="relative min-h-[88vh] overflow-hidden bg-ink text-white">
      <img
        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2000&q=80"
        alt="Travelers exploring a European city street"
        class="absolute inset-0 h-full w-full object-cover animate-kenburns"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />

      <div class="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
        <p class="animate-fade-up font-display text-sm font-semibold uppercase tracking-[0.28em] text-white/80">
          Horizons
        </p>
        <h1 class="animate-fade-up delay-1 mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          <template v-if="user.isConnected && user.displayName">
            Hello, {{ user.displayName }}!<br>Speak the world.
          </template>
          <template v-else>
            Speak the world.<br>Live the language.
          </template>
        </h1>
        <p class="animate-fade-up delay-2 mt-5 max-w-xl text-lg text-white/85 md:text-xl">
          <template v-if="user.isConnected && trip.hasSavedTrip">
            Your trip is set for <strong>{{ trip.language }}</strong> in
            <strong>{{ trip.destination?.city }}</strong> — explore matching programs.
          </template>
          <template v-else-if="user.isConnected">
            You can now build a personalized stay and unlock language-specific trip ideas.
          </template>
          <template v-else>
            Language courses at home — linguistic stays in London, Madrid, Paris &amp; Berlin.
          </template>
        </p>
        <div class="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
          <NuxtLink
            to="/courses"
            class="inline-flex items-center gap-2 bg-sea px-6 py-3.5 font-display text-base font-semibold text-white transition hover:bg-white hover:text-ink"
          >
            Discover our programs
            <span aria-hidden="true">→</span>
          </NuxtLink>
          <NuxtLink
            :to="user.isConnected ? '/build-trip' : '/login?redirect=/build-trip'"
            class="inline-flex items-center gap-2 border border-white/50 px-6 py-3.5 font-display text-base font-semibold text-white transition hover:bg-white hover:text-ink"
          >
            Build your trip
          </NuxtLink>
          <NuxtLink
            v-if="!user.isConnected"
            to="/login"
            class="inline-flex items-center gap-2 border border-white/50 px-6 py-3.5 font-display text-base font-semibold text-white transition hover:bg-white hover:text-ink"
          >
            Log in
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Preview strip: one job — point to courses & trips -->
    <section class="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <h2 class="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Two ways to grow
      </h2>
      <p class="mt-3 max-w-2xl text-lg text-muted-foreground">
        Build your foundations in class, then immerse yourself where the language lives.
      </p>

      <div class="mt-12 grid gap-10 md:grid-cols-2">
        <NuxtLink to="/courses" class="group block">
          <div class="overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
              alt="Students studying languages together"
              class="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
            >
          </div>
          <h3 class="mt-5 font-display text-2xl font-bold text-ink group-hover:text-sea">
            Language Courses
          </h3>
          <p class="mt-2 text-muted-foreground">
            English, Spanish, French &amp; German — from beginner to advanced.
          </p>
        </NuxtLink>

        <NuxtLink to="/trips" class="group block">
          <div class="overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80"
              alt="London city skyline"
              class="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
            >
          </div>
          <h3 class="mt-5 font-display text-2xl font-bold text-ink group-hover:text-sea">
            Language Trips
          </h3>
          <p class="mt-2 text-muted-foreground">
            Immersion stays in London, Madrid, Paris &amp; Berlin.
          </p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Horizons — Language courses & linguistic stays',
})

const user = useUserStore()
const trip = useTripBuilderStore()
</script>
