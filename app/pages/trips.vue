<template>
  <div>
    <section class="border-b border-ink/10 bg-mist/40">
      <div class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p class="font-display text-sm font-semibold uppercase tracking-[0.22em] text-sea">
          Immersion
        </p>
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Language Trips
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-muted-foreground">
          Live the language where it is spoken every day — classes in the morning, city life in the afternoon.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div class="grid gap-12 sm:grid-cols-2">
        <NuxtLink
          v-for="trip in trips"
          :key="trip.city"
          to="/contact"
          class="group block"
        >
          <div class="relative overflow-hidden">
            <img
              :src="trip.image"
              :alt="trip.alt"
              class="aspect-[5/4] w-full object-cover transition duration-700 group-hover:scale-105"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <div class="absolute inset-x-0 bottom-0 p-6 text-white">
              <p class="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                {{ trip.language }}
              </p>
              <h2 class="mt-1 font-display text-3xl font-bold">
                {{ trip.city }}
              </h2>
            </div>
          </div>
          <p class="mt-4 text-muted-foreground">
            {{ trip.description }}
          </p>
          <p class="mt-2 font-display text-sm font-semibold text-sea group-hover:underline">
            {{ trip.duration }} · Apply →
          </p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({ title: 'Language Trips — Horizons' })

const trips = [
  {
    city: 'London',
    language: 'English immersion',
    duration: '2–4 weeks',
    description:
      'Study in the heart of the UK capital: museums, markets, and everyday English all around you.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    alt: 'London Tower Bridge and skyline',
  },
  {
    city: 'Madrid',
    language: 'Spanish immersion',
    duration: '2–4 weeks',
    description:
      'Sunlit plazas, tapas evenings, and Spanish classes that spill into real conversations.',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
    alt: 'Madrid city view',
  },
  {
    city: 'Paris',
    language: 'French immersion',
    duration: '2–4 weeks',
    description:
      'Cafés, galleries, and French spoken on every corner — practice beyond the classroom.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    alt: 'Eiffel Tower in Paris',
  },
  {
    city: 'Berlin',
    language: 'German immersion',
    duration: '2–4 weeks',
    description:
      'A creative capital where German history, design, and daily life sharpen your skills.',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80',
    alt: 'Berlin Brandenburg Gate',
  },
]
</script>
