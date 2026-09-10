<template>
  <div>
    <section class="border-b border-ink/10 bg-mist/40">
      <div class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p class="font-display text-sm font-semibold uppercase tracking-[0.22em] text-sea">
          Your account
        </p>
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          My Trips
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-muted-foreground">
          Every saved trip is stored as its own row in Supabase, linked to your profile
          and a shared destination.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <NuxtLink
            to="/build-trip"
            class="inline-flex bg-sea px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-ink"
          >
            Build another trip →
          </NuxtLink>

          <label class="font-display text-sm font-semibold text-ink">
            Sort
            <select
              v-model="sortMode"
              class="ml-2 border border-ink/20 bg-white px-3 py-2 font-normal outline-none focus:border-sea"
              @change="reload"
            >
              <option value="newest">Newest first</option>
              <option value="asc">Price: low to high</option>
              <option value="desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <UserEmptyState
        v-if="!user.isConnected"
        title="Log in required"
        message="Sign in to see the trips saved on your account."
      />

      <UserEmptyState
        v-else-if="!loading && !trips.length"
        title="No trips yet"
        message="Build Your Language Trip and click Save my trip — each save creates a new trip row."
      />

      <p
        v-if="error"
        class="mb-8 border border-destructive/40 bg-destructive/5 px-4 py-3 text-destructive"
      >
        {{ error }}
      </p>

      <div
        v-if="trips.length"
        class="grid gap-8 md:grid-cols-2"
      >
        <article
          v-for="item in trips"
          :key="item.trip_id"
          class="border border-ink/10 bg-white"
        >
          <div
            v-if="item.destinations?.image"
            class="overflow-hidden"
          >
            <img
              :src="item.destinations.image"
              :alt="item.destinations.city"
              class="aspect-[16/10] w-full object-cover"
            >
          </div>
          <div class="px-6 py-6">
            <p class="font-display text-xs font-semibold uppercase tracking-[0.2em] text-sea">
              {{ item.destinations?.language || 'Language' }}
            </p>
            <h2 class="mt-2 font-display text-2xl font-bold text-ink">
              {{ item.destinations?.city }}, {{ item.destinations?.country }}
            </h2>

            <!-- Edit form -->
            <form
              v-if="editingId === item.trip_id"
              class="mt-5 space-y-4"
              @submit.prevent="saveEdit(item)"
            >
              <label class="block font-display text-sm font-semibold text-ink">
                Duration
                <select
                  v-model.number="editForm.duration"
                  class="mt-1 w-full border border-ink/20 bg-white px-3 py-2 font-normal outline-none focus:border-sea"
                >
                  <option
                    v-for="weeks in DURATIONS"
                    :key="weeks"
                    :value="weeks"
                  >
                    {{ weeks }} {{ weeks === 1 ? 'week' : 'weeks' }}
                  </option>
                </select>
              </label>

              <label class="block font-display text-sm font-semibold text-ink">
                Course type
                <select
                  v-model="editForm.courseType"
                  class="mt-1 w-full border border-ink/20 bg-white px-3 py-2 font-normal outline-none focus:border-sea"
                >
                  <option
                    v-for="type in COURSE_TYPES"
                    :key="type"
                    :value="type"
                  >
                    {{ type }}
                  </option>
                </select>
              </label>

              <label class="block font-display text-sm font-semibold text-ink">
                Accommodation
                <select
                  v-model="editForm.accommodation"
                  class="mt-1 w-full border border-ink/20 bg-white px-3 py-2 font-normal outline-none focus:border-sea"
                >
                  <option
                    v-for="option in ACCOMMODATIONS"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </label>

              <p class="font-display text-lg font-bold text-ink">
                New total: {{ formatEuro(previewPrice) }}
              </p>

              <div class="flex flex-wrap gap-2">
                <button
                  type="submit"
                  class="bg-sea px-4 py-2 font-display text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60"
                  :disabled="saving"
                >
                  {{ saving ? 'Saving…' : 'Save changes' }}
                </button>
                <button
                  type="button"
                  class="border border-ink/20 px-4 py-2 font-display text-sm font-semibold text-ink transition hover:border-sea"
                  :disabled="saving"
                  @click="cancelEdit"
                >
                  Cancel
                </button>
              </div>
            </form>

            <!-- Read-only view -->
            <template v-else>
              <ul class="mt-5 space-y-2 text-ink/85">
                <li>{{ item.duration }} {{ item.duration === 1 ? 'week' : 'weeks' }}</li>
                <li>{{ item.course_type }} course</li>
                <li>{{ item.accommodation }}</li>
                <li v-if="activityLabels(item.activities).length">
                  Activities: {{ activityLabels(item.activities).join(', ') }}
                </li>
                <li v-else class="text-muted-foreground">
                  No optional activities
                </li>
              </ul>

              <p class="mt-6 font-display text-2xl font-bold text-ink">
                {{ formatEuro(Number(item.total_price)) }}
              </p>
              <p class="mt-1 text-sm text-muted-foreground">
                Saved {{ formatDate(item.created_at) }}
              </p>

              <div class="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  class="border border-ink/20 px-4 py-2 font-display text-sm font-semibold text-ink transition hover:border-sea"
                  :disabled="loading"
                  @click="startEdit(item)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="border border-destructive/40 px-4 py-2 font-display text-sm font-semibold text-destructive transition hover:bg-destructive/5"
                  :disabled="loading"
                  @click="confirmDelete(item)"
                >
                  Delete
                </button>
              </div>
            </template>
          </div>
        </article>
      </div>

      <div
        v-if="trips.length > 1"
        class="mt-12 border border-ink/10 bg-mist/40 px-6 py-6"
      >
        <p class="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sea">
          Price comparison
        </p>
        <p class="mt-2 text-lg text-ink">
          Lowest: <strong>{{ formatEuro(minPrice) }}</strong>
          · Highest: <strong>{{ formatEuro(maxPrice) }}</strong>
          · Average: <strong>{{ formatEuro(avgPrice) }}</strong>
        </p>
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
  formatEuro,
} from '~/data/tripCatalog'

useHead({ title: 'My Trips — Horizons' })

const user = useUserStore()
const trip = useTripBuilderStore()
const { trips, loading, error, fetchTrips, updateTrip, deleteTrip } = useTrips()
const sortMode = ref('newest')

const editingId = ref(null)
const saving = ref(false)
const editForm = reactive({
  duration: 1,
  courseType: 'Standard',
  accommodation: 'Host Family',
  activities: [],
})

const previewPrice = computed(() => {
  const course = (COURSE_WEEKLY[editForm.courseType] || 0) * editForm.duration
  const lodging = (ACCOMMODATION_WEEKLY[editForm.accommodation] || 0) * editForm.duration
  const activitiesTotal = editForm.activities.reduce((sum, id) => {
    const item = ACTIVITIES.find(a => a.id === id)
    return sum + (item?.price ?? 0)
  }, 0)
  return course + lodging + activitiesTotal
})

const minPrice = computed(() =>
  Math.min(...trips.value.map(t => Number(t.total_price))),
)
const maxPrice = computed(() =>
  Math.max(...trips.value.map(t => Number(t.total_price))),
)
const avgPrice = computed(() => {
  const total = trips.value.reduce((sum, t) => sum + Number(t.total_price), 0)
  return Math.round(total / trips.value.length)
})

function activityLabels(ids = []) {
  return ACTIVITIES.filter(a => ids.includes(a.id)).map(a => a.label)
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function startEdit(item) {
  editingId.value = item.trip_id
  editForm.duration = item.duration
  editForm.courseType = item.course_type
  editForm.accommodation = item.accommodation
  editForm.activities = [...(item.activities || [])]
}

function cancelEdit() {
  editingId.value = null
}

async function saveEdit(item) {
  saving.value = true
  const updated = await updateTrip(item.trip_id, {
    duration: editForm.duration,
    courseType: editForm.courseType,
    accommodation: editForm.accommodation,
    activities: editForm.activities,
  })
  saving.value = false

  if (!updated) return

  editingId.value = null
  trip.savedTrips = trips.value
}

async function confirmDelete(item) {
  const city = item.destinations?.city || 'this trip'
  const ok = window.confirm(
    `Delete the trip to ${city}? This cannot be undone.`,
  )
  if (!ok) return

  const deleted = await deleteTrip(item.trip_id)
  if (!deleted) return

  if (editingId.value === item.trip_id) editingId.value = null
  trip.savedTrips = trips.value
}

async function reload() {
  if (!user.isConnected) return
  await fetchTrips(sortMode.value)
  trip.savedTrips = trips.value
}

onMounted(reload)
watch(() => user.isConnected, (connected) => {
  if (connected) reload()
})
</script>
