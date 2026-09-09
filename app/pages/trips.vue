<template>
  <div>
    <section class="border-b border-ink/10 bg-mist/40">
      <div class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p class="font-display text-sm font-semibold uppercase tracking-[0.22em] text-sea">
          Immersion
        </p>
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          {{ personalized ? `${focusLanguage} Language Trips` : 'Language Trips' }}
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-muted-foreground">
          <template v-if="personalized">
            Based on your latest saved trip, here are {{ focusLanguage }} immersion destinations
            you can explore — your pick
            <strong class="text-ink">{{ highlightedCity }}</strong>
            is highlighted.
          </template>
          <template v-else>
            Live the language where it is spoken every day — classes in the morning, city life in the afternoon.
            Complete <NuxtLink :to="buildTripLink" class="font-semibold text-sea hover:underline">Build Your Language Trip</NuxtLink>
            to personalize this page.
          </template>
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <NuxtLink
            :to="buildTripLink"
            class="inline-flex bg-sea px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-ink"
          >
            {{ personalized ? 'Edit my trip →' : 'Build Your Language Trip →' }}
          </NuxtLink>
          <NuxtLink
            v-if="personalized"
            to="/courses"
            class="inline-flex border border-ink/20 px-5 py-3 font-display text-sm font-semibold text-ink transition hover:border-ink"
          >
            See {{ focusLanguage }} courses
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div class="grid gap-12 sm:grid-cols-2">
        <article
          v-for="item in displayedTrips"
          :key="item.id"
          class="group block"
          :class="item.id === highlightedDestinationId ? 'ring-2 ring-sea ring-offset-4 ring-offset-background' : ''"
        >
          <div class="relative overflow-hidden">
            <img
              :src="item.image"
              :alt="item.alt"
              class="aspect-[5/4] w-full object-cover transition duration-700 group-hover:scale-105"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <div class="absolute inset-x-0 bottom-0 p-6 text-white">
              <p class="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                {{ personalized ? `${focusLanguage} immersion` : immersionLabel(item.id) }}
              </p>
              <h2 class="mt-1 font-display text-3xl font-bold">
                {{ item.city }}
              </h2>
              <p class="mt-1 text-sm text-white/80">
                {{ item.country }}
              </p>
            </div>
            <span
              v-if="personalized && item.id === highlightedDestinationId"
              class="absolute right-4 top-4 bg-sea px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wide text-white"
            >
              Your destination
            </span>
          </div>
          <p class="mt-4 text-muted-foreground">
            {{ item.description }}
          </p>
          <p class="mt-2 font-display text-sm font-semibold text-sea">
            {{ item.duration }}
            <NuxtLink to="/contact" class="group-hover:underline">
              · Apply →
            </NuxtLink>
          </p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  DEFAULT_TRIP_PREVIEWS,
  DESTINATIONS_BY_LANGUAGE,
} from '~/data/tripCatalog'

useHead({ title: 'Language Trips — Horizons' })

const trip = useTripBuilderStore()
const user = useUserStore()

const personalized = computed(() => user.isConnected && trip.hasSavedTrip)
const buildTripLink = computed(() => user.isConnected ? '/build-trip' : '/login?redirect=/build-trip')

const focusLanguage = computed(() =>
  trip.latestSavedTrip?.destinations?.language || trip.language || '',
)

const highlightedDestinationId = computed(() =>
  trip.latestSavedTrip?.destination_id || trip.destinationId || '',
)

const highlightedCity = computed(() =>
  trip.latestSavedTrip?.destinations?.city || trip.destination?.city || '',
)

const displayedTrips = computed(() => {
  if (personalized.value && focusLanguage.value) {
    return DESTINATIONS_BY_LANGUAGE[focusLanguage.value]
  }
  return DEFAULT_TRIP_PREVIEWS
})

const languageByDefaultId = {
  london: 'English immersion',
  madrid: 'Spanish immersion',
  paris: 'French immersion',
  berlin: 'German immersion',
}

function immersionLabel(id) {
  return languageByDefaultId[id] || 'Language immersion'
}
</script>
