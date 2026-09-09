<template>
  <div>
    <section class="border-b border-ink/10 bg-mist/40">
      <div class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p class="font-display text-sm font-semibold uppercase tracking-[0.22em] text-sea">
          Programs
        </p>
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          {{ personalized ? `${focused.name} Courses` : 'Language Courses' }}
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-muted-foreground">
          <template v-if="personalized && focused">
            Tailored to your latest saved trip:
            <strong class="text-ink">{{ latestCourseType }}</strong>
            {{ focused.name }} preparation for
            <strong class="text-ink">{{ latestDestinationLabel }}</strong>
            ({{ latestDuration }} {{ latestDuration === 1 ? 'week' : 'weeks' }}).
          </template>
          <template v-else>
            Structured classes led by native-speaking teachers. Choose the language that opens your next horizon —
            or <NuxtLink :to="buildTripLink" class="font-semibold text-sea hover:underline">build your trip</NuxtLink>
            to focus this page on one language.
          </template>
        </p>
        <NuxtLink
          v-if="personalized"
          to="/trips"
          class="mt-8 inline-flex bg-sea px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-ink"
        >
          See {{ focused?.name }} trip destinations →
        </NuxtLink>
      </div>
    </section>

    <!-- Personalized single-language view -->
    <section
      v-if="personalized && focused"
      class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24"
    >
      <article class="grid items-start gap-10 md:grid-cols-2 md:gap-14">
        <div class="overflow-hidden">
          <img
            :src="focused.image"
            :alt="focused.alt"
            class="aspect-[4/3] w-full object-cover"
          >
        </div>
        <div>
          <p class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sea">
            {{ focused.level }} · {{ focused.tagline }}
          </p>
          <h2 class="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">
            {{ focused.name }}
          </h2>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {{ focused.description }}
          </p>

          <div class="mt-8 border border-ink/10 bg-white px-5 py-5">
            <p class="font-display text-sm font-semibold text-ink">
              Your planned track
            </p>
            <ul class="mt-3 space-y-2 text-ink/85">
              <li class="flex gap-2">
                <span class="text-sea" aria-hidden="true">—</span>
                Course type: <strong>{{ latestCourseType }}</strong>
                ({{ focused.weeklyHours[latestCourseType] }})
              </li>
              <li class="flex gap-2">
                <span class="text-sea" aria-hidden="true">—</span>
                Stay length: {{ latestDuration }}
                {{ latestDuration === 1 ? 'week' : 'weeks' }}
              </li>
              <li class="flex gap-2">
                <span class="text-sea" aria-hidden="true">—</span>
                Destination focus: {{ trip.latestSavedTrip?.destinations?.city || trip.destination?.city }}
              </li>
              <li class="flex gap-2">
                <span class="text-sea" aria-hidden="true">—</span>
                Accommodation: {{ trip.latestSavedTrip?.accommodation || trip.accommodation }}
              </li>
            </ul>
          </div>

          <h3 class="mt-10 font-display text-xl font-bold text-ink">
            Program highlights
          </h3>
          <ul class="mt-4 space-y-2 text-ink/80">
            <li v-for="item in focused.highlights" :key="item" class="flex gap-2">
              <span class="text-sea" aria-hidden="true">—</span>
              {{ item }}
            </li>
          </ul>

          <h3 class="mt-10 font-display text-xl font-bold text-ink">
            Modules for {{ focused.name }}
          </h3>
          <ul class="mt-4 space-y-2 text-ink/80">
            <li v-for="mod in focused.modules" :key="mod" class="flex gap-2">
              <span class="text-sea" aria-hidden="true">—</span>
              {{ mod }}
            </li>
          </ul>

          <h3 class="mt-10 font-display text-xl font-bold text-ink">
            Exam pathways
          </h3>
          <p class="mt-3 text-muted-foreground">
            {{ focused.exams.join(' · ') }}
          </p>

          <h3 class="mt-10 font-display text-xl font-bold text-ink">
            Matching immersion cities
          </h3>
          <ul class="mt-4 flex flex-wrap gap-2">
            <li
              v-for="dest in matchingDestinations"
              :key="dest.id"
              class="border border-ink/15 bg-white px-3 py-2 font-display text-sm font-semibold text-ink"
              :class="dest.id === highlightedDestinationId ? 'border-sea bg-sea/10 text-sea' : ''"
            >
              {{ dest.city }}
            </li>
          </ul>

          <NuxtLink
            to="/contact"
            class="mt-10 inline-flex bg-sea px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-ink"
          >
            Apply for {{ focused.name }}
          </NuxtLink>
        </div>
      </article>
    </section>

    <!-- Default multi-language catalog -->
    <section
      v-else
      class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24"
    >
      <div class="space-y-20">
        <article
          v-for="(course, i) in DEFAULT_COURSES"
          :key="course.slug"
          class="grid items-center gap-8 md:grid-cols-2 md:gap-14"
          :class="i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''"
        >
          <div class="overflow-hidden">
            <img
              :src="course.image"
              :alt="course.alt"
              class="aspect-[4/3] w-full object-cover"
            >
          </div>
          <div>
            <p class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sea">
              {{ course.level }}
            </p>
            <h2 class="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">
              {{ course.name }}
            </h2>
            <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
              {{ course.description }}
            </p>
            <ul class="mt-6 space-y-2 text-ink/80">
              <li v-for="item in course.highlights" :key="item" class="flex gap-2">
                <span class="text-sea" aria-hidden="true">—</span>
                {{ item }}
              </li>
            </ul>
            <NuxtLink
              to="/contact"
              class="mt-8 inline-flex bg-sea px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-ink"
            >
              Apply for {{ course.name }}
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  COURSES_BY_LANGUAGE,
  DEFAULT_COURSES,
  DESTINATIONS_BY_LANGUAGE,
} from '~/data/tripCatalog'

useHead({ title: 'Language Courses — Horizons' })

const trip = useTripBuilderStore()
const user = useUserStore()

const personalized = computed(() => user.isConnected && trip.hasSavedTrip)
const buildTripLink = computed(() => user.isConnected ? '/build-trip' : '/login?redirect=/build-trip')

const focusLanguage = computed(() =>
  trip.latestSavedTrip?.destinations?.language || trip.language || '',
)

const latestCourseType = computed(() =>
  trip.latestSavedTrip?.course_type || trip.courseType || '',
)

const latestDuration = computed(() =>
  trip.latestSavedTrip?.duration || trip.durationWeeks || 0,
)

const latestDestinationLabel = computed(() => {
  const dest = trip.latestSavedTrip?.destinations
  if (dest) return `${dest.city}, ${dest.country}`
  return trip.destination?.label || ''
})

const highlightedDestinationId = computed(() =>
  trip.latestSavedTrip?.destination_id || trip.destinationId || '',
)

const focused = computed(() => {
  if (!personalized.value || !focusLanguage.value) return null
  return COURSES_BY_LANGUAGE[focusLanguage.value]
})

const matchingDestinations = computed(() => {
  if (!focusLanguage.value) return []
  return DESTINATIONS_BY_LANGUAGE[focusLanguage.value]
})
</script>
