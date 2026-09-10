<template>
  <div>
    <section class="border-b border-ink/10 bg-mist/40">
      <div class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p class="font-display text-sm font-semibold uppercase tracking-[0.22em] text-sea">
          Plan your stay
        </p>
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Build Your Language Trip
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-muted-foreground">
          Choose your language, destination, duration, course and accommodation —
          your summary and price update as you go.
        </p>
      </div>
    </section>

    <section
      v-if="!user.isConnected"
      class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24"
    >
      <div class="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div class="border border-ink/10 bg-white px-6 py-8">
          <p class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sea">
            Sign up first
          </p>
          <h2 class="mt-3 font-display text-3xl font-bold text-ink">
            Connect before building your trip
          </h2>
          <p class="mt-4 text-lg text-muted-foreground">
            Build Your Language Trip is available after sign up / log in.
            We only ask for your email address and password.
          </p>
          <NuxtLink
            to="/login?redirect=/build-trip"
            class="mt-8 inline-flex bg-sea px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-ink"
          >
            Go to Sign up / Log in
          </NuxtLink>
        </div>

        <UserEmptyState
          title="Trip builder locked"
          message="Connect first, then come back here to choose your language, city, duration and activities."
        />
      </div>
    </section>

    <section
      v-else
      class="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-24"
    >
      <div>
        <h2 class="font-display text-2xl font-bold text-ink">
          Your options
        </h2>

        <form class="mt-8 space-y-8" @submit.prevent="onSave">
          <fieldset>
            <legend class="mb-3 font-display text-sm font-semibold text-ink">
              1. Language
            </legend>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="lang in LANGUAGES"
                :key="lang"
                type="button"
                class="border px-4 py-2.5 font-display text-sm font-semibold transition"
                :class="trip.language === lang
                  ? 'border-sea bg-sea text-white'
                  : 'border-ink/20 bg-white text-ink hover:border-sea'"
                @click="onLanguage(lang)"
              >
                {{ lang }}
              </button>
            </div>
          </fieldset>

          <fieldset>
            <legend class="mb-3 font-display text-sm font-semibold text-ink">
              2. Destination
            </legend>
            <p
              v-if="!trip.language"
              class="text-sm text-muted-foreground"
            >
              Select a language first to see available cities.
            </p>
            <div v-else class="flex flex-wrap gap-2">
              <button
                v-for="dest in trip.availableDestinations"
                :key="dest.id"
                type="button"
                class="border px-4 py-2.5 font-display text-sm font-semibold transition"
                :class="trip.destinationId === dest.id
                  ? 'border-sea bg-sea text-white'
                  : 'border-ink/20 bg-white text-ink hover:border-sea'"
                @click="trip.destinationId = dest.id; markEdited()"
              >
                {{ dest.label }}
              </button>
            </div>
            <p
              v-if="destinationsError"
              class="mt-3 text-sm text-destructive"
            >
              {{ destinationsError }}
            </p>
          </fieldset>

          <fieldset>
            <legend class="mb-3 font-display text-sm font-semibold text-ink">
              3. Duration
            </legend>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="weeks in DURATIONS"
                :key="weeks"
                type="button"
                class="border px-4 py-2.5 font-display text-sm font-semibold transition"
                :class="trip.durationWeeks === weeks
                  ? 'border-sea bg-sea text-white'
                  : 'border-ink/20 bg-white text-ink hover:border-sea'"
                @click="trip.durationWeeks = weeks; markEdited()"
              >
                {{ weeks }} {{ weeks === 1 ? 'week' : 'weeks' }}
              </button>
            </div>
          </fieldset>

          <fieldset>
            <legend class="mb-3 font-display text-sm font-semibold text-ink">
              4. Course type
            </legend>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="type in COURSE_TYPES"
                :key="type"
                type="button"
                class="border px-4 py-2.5 font-display text-sm font-semibold transition"
                :class="trip.courseType === type
                  ? 'border-sea bg-sea text-white'
                  : 'border-ink/20 bg-white text-ink hover:border-sea'"
                @click="trip.courseType = type; markEdited()"
              >
                {{ type }}
                <span class="ml-1 text-xs font-normal opacity-80">
                  (€{{ COURSE_WEEKLY[type] }}/week)
                </span>
              </button>
            </div>
          </fieldset>

          <fieldset>
            <legend class="mb-3 font-display text-sm font-semibold text-ink">
              5. Accommodation
            </legend>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in ACCOMMODATIONS"
                :key="option"
                type="button"
                class="border px-4 py-2.5 font-display text-sm font-semibold transition"
                :class="trip.accommodation === option
                  ? 'border-sea bg-sea text-white'
                  : 'border-ink/20 bg-white text-ink hover:border-sea'"
                @click="trip.accommodation = option; markEdited()"
              >
                {{ option }}
                <span class="ml-1 text-xs font-normal opacity-80">
                  {{ ACCOMMODATION_WEEKLY[option] === 0
                    ? '(€0)'
                    : `(€${ACCOMMODATION_WEEKLY[option]}/week)` }}
                </span>
              </button>
            </div>
          </fieldset>

          <fieldset>
            <legend class="mb-3 font-display text-sm font-semibold text-ink">
              6. Optional activities
            </legend>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="activity in ACTIVITIES"
                :key="activity.id"
                type="button"
                class="border px-4 py-2.5 font-display text-sm font-semibold transition"
                :class="trip.activities.includes(activity.id)
                  ? 'border-sea bg-sea text-white'
                  : 'border-ink/20 bg-white text-ink hover:border-sea'"
                @click="trip.toggleActivity(activity.id); markEdited()"
              >
                {{ activity.label }}
                <span class="ml-1 text-xs font-normal opacity-80">
                  (+€{{ activity.price }})
                </span>
              </button>
            </div>
          </fieldset>

          <div class="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              class="bg-sea px-6 py-3.5 font-display text-base font-semibold text-white transition hover:bg-ink disabled:opacity-60"
              :disabled="trip.isSyncing"
            >
              {{ trip.isSyncing ? 'Saving…' : 'Save my trip' }}
            </button>
            <button
              type="button"
              class="border border-ink/20 px-6 py-3.5 font-display text-base font-semibold text-ink transition hover:border-ink"
              @click="onReset"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div class="lg:sticky lg:top-24 lg:self-start">
        <h2 class="font-display text-2xl font-bold text-ink">
          Trip summary
        </h2>

        <div class="mt-6 space-y-6">
          <UserEmptyState
            v-if="!trip.hasAnySelection"
            title="Empty state"
            message="Nothing selected yet. Pick a language to start building your stay — destinations will appear next."
          />

          <UserInvalidState
            v-if="saveAttempted && !trip.isComplete"
            :errors="trip.validationErrors"
          />

          <div
            v-if="trip.hasAnySelection"
            class="border border-ink/10 bg-white px-6 py-8"
          >
            <p class="font-display text-xs font-semibold uppercase tracking-[0.22em] text-sea">
              Your trip
            </p>

            <h3 class="mt-3 font-display text-3xl font-bold text-ink">
              {{ trip.destination?.label || 'Destination pending' }}
            </h3>

            <ul class="mt-6 space-y-2 text-lg text-ink/85">
              <li :class="{ 'text-muted-foreground': !trip.language }">
                {{ trip.language || 'Language not selected' }}
              </li>
              <li :class="{ 'text-muted-foreground': !trip.durationWeeks }">
                <template v-if="trip.durationWeeks">
                  {{ trip.durationWeeks }}
                  {{ trip.durationWeeks === 1 ? 'week' : 'weeks' }}
                </template>
                <template v-else>
                  Duration not selected
                </template>
              </li>
              <li :class="{ 'text-muted-foreground': !trip.courseType }">
                {{ trip.courseType ? `${trip.courseType} Course` : 'Course type not selected' }}
              </li>
              <li :class="{ 'text-muted-foreground': !trip.accommodation }">
                {{ trip.accommodation || 'Accommodation not selected' }}
              </li>
              <li v-if="selectedActivityLabels.length">
                Activities: {{ selectedActivityLabels.join(', ') }}
              </li>
              <li v-else class="text-muted-foreground">
                No optional activities
              </li>
            </ul>

            <div class="mt-8 space-y-2 border-t border-ink/10 pt-6 font-display text-base">
              <div class="flex justify-between text-ink/80">
                <span>Course</span>
                <span>{{ formatEuro(trip.coursePrice) }}</span>
              </div>
              <div class="flex justify-between text-ink/80">
                <span>Accommodation</span>
                <span>{{ formatEuro(trip.accommodationPrice) }}</span>
              </div>
              <div class="flex justify-between text-ink/80">
                <span>Activities</span>
                <span>{{ formatEuro(trip.activitiesPrice) }}</span>
              </div>
              <div class="flex justify-between border-t border-ink/10 pt-3 text-xl font-bold text-ink">
                <span>Total</span>
                <span>{{ formatEuro(trip.totalPrice) }}</span>
              </div>
            </div>

            <p
              v-if="trip.syncError"
              class="mt-6 border border-destructive/40 bg-destructive/5 px-4 py-3 font-display text-sm font-semibold text-destructive"
            >
              {{ trip.syncError }}
            </p>

            <p
              v-if="justSaved || (trip.savedAt && trip.isComplete && !saveAttempted)"
              class="mt-6 border border-sea/30 bg-sea/5 px-4 py-3 font-display text-sm font-semibold text-sea"
            >
              Trip saved as a new row.
              <span class="mt-2 block font-normal text-ink/80">
                View all your trips on
                <NuxtLink to="/my-trips" class="font-semibold text-sea hover:underline">My Trips</NuxtLink>
                — or keep building another itinerary below.
              </span>
            </p>
          </div>

          <p class="text-sm text-muted-foreground">
            Ready to apply?
            <NuxtLink to="/contact" class="font-display font-semibold text-sea hover:underline">
              Contact us
            </NuxtLink>
            with this itinerary.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  ACCOMMODATIONS,
  ACCOMMODATION_WEEKLY,
  ACTIVITIES,
  COURSE_TYPES,
  COURSE_WEEKLY,
  DURATIONS,
  LANGUAGES,
  formatEuro,
} from '~/data/tripCatalog'

useHead({ title: 'Build Your Language Trip — Horizons' })

const trip = useTripBuilderStore()
const user = useUserStore()
const { fetchDestinations, error: destinationsError } = useDestinations()

const saveAttempted = ref(false)
const justSaved = ref(false)

const selectedActivityLabels = computed(() =>
  ACTIVITIES
    .filter(a => trip.activities.includes(a.id))
    .map(a => a.label),
)

onMounted(async () => {
  if (!user.isConnected || !user.id) return
  await fetchDestinations()
  await trip.loadFromDatabase()
})

watch(
  () => user.id,
  async (id) => {
    if (!id) return
    await fetchDestinations()
    await trip.loadFromDatabase()
  },
)

function markEdited() {
  justSaved.value = false
  if (trip.savedAt) trip.savedAt = null
}

function onLanguage(lang) {
  trip.setLanguage(lang)
  markEdited()
}

async function onSave() {
  saveAttempted.value = true
  justSaved.value = false
  const ok = await trip.saveTrip()
  if (!ok) return
  justSaved.value = true
  saveAttempted.value = false
}

function onReset() {
  trip.resetTrip()
  saveAttempted.value = false
  justSaved.value = false
}
</script>
