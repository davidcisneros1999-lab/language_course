import { defineStore } from 'pinia'
import {
  type Accommodation,
  type ActivityId,
  type CourseType,
  type Language,
  ACCOMMODATION_WEEKLY,
  ACTIVITIES,
  COURSE_WEEKLY,
  DESTINATIONS_BY_LANGUAGE,
  findDestination,
} from '~/data/tripCatalog'
import type { SavedTripRow } from '~/types/database.types'

export const useTripBuilderStore = defineStore(
  'tripBuilder',
  () => {
    const language = ref<Language | ''>('')
    const destinationId = ref('')
    const durationWeeks = ref<number | null>(null)
    const courseType = ref<CourseType | ''>('')
    const accommodation = ref<Accommodation | ''>('')
    const activities = ref<ActivityId[]>([])
    const savedAt = ref<string | null>(null)
    const lastSavedTripId = ref<string | null>(null)
    const syncError = ref('')
    const isSyncing = ref(false)
    const savedTrips = ref<SavedTripRow[]>([])

    const availableDestinations = computed(() => {
      if (!language.value) return []

      const { destinationsByLanguage } = useDestinations()
      const fromDb = destinationsByLanguage(language.value)

      if (fromDb.length) {
        return fromDb.map(d => ({
          id: d.destination_id,
          city: d.city,
          country: d.country,
          label: `${d.city}, ${d.country}`,
          description: d.description || '',
          image: d.image || '',
        }))
      }

      return DESTINATIONS_BY_LANGUAGE[language.value]
    })

    const destination = computed(() =>
      findDestination(language.value, destinationId.value)
      || availableDestinations.value.find(d => d.id === destinationId.value)
      || null,
    )

    const coursePrice = computed(() => {
      if (!courseType.value || !durationWeeks.value) return 0
      return COURSE_WEEKLY[courseType.value] * durationWeeks.value
    })

    const accommodationPrice = computed(() => {
      if (!accommodation.value || !durationWeeks.value) return 0
      return ACCOMMODATION_WEEKLY[accommodation.value] * durationWeeks.value
    })

    const activitiesPrice = computed(() =>
      activities.value.reduce((sum, id) => {
        const item = ACTIVITIES.find(a => a.id === id)
        return sum + (item?.price ?? 0)
      }, 0),
    )

    const totalPrice = computed(
      () => coursePrice.value + accommodationPrice.value + activitiesPrice.value,
    )

    const hasAnySelection = computed(
      () =>
        Boolean(language.value)
        || Boolean(destinationId.value)
        || durationWeeks.value !== null
        || Boolean(courseType.value)
        || Boolean(accommodation.value)
        || activities.value.length > 0,
    )

    const validationErrors = computed(() => {
      const list = []
      if (!language.value) list.push('Please choose a language.')
      if (!destinationId.value) list.push('Please choose a destination.')
      if (!durationWeeks.value) list.push('Please choose a duration.')
      if (!courseType.value) list.push('Please choose a course type.')
      if (!accommodation.value) list.push('Please choose an accommodation option.')
      return list
    })

    const isComplete = computed(() => validationErrors.value.length === 0)

    /** Latest saved trip used to personalize Courses / Language Trips */
    const latestSavedTrip = computed(() => savedTrips.value[0] || null)

    const hasSavedTrip = computed(() => savedTrips.value.length > 0)

    function setLanguage(next: Language | '') {
      language.value = next
      destinationId.value = ''
      savedAt.value = null
      lastSavedTripId.value = null
    }

    function toggleActivity(id: ActivityId) {
      const index = activities.value.indexOf(id)
      if (index === -1) {
        activities.value = [...activities.value, id]
      }
      else {
        activities.value = activities.value.filter(a => a.id !== id)
      }
      savedAt.value = null
      lastSavedTripId.value = null
    }

    function applyLatestTripToForm(trip: SavedTripRow) {
      const dest = trip.destinations
      if (!dest) return false

      language.value = dest.language as Language
      destinationId.value = trip.destination_id
      durationWeeks.value = trip.duration
      courseType.value = trip.course_type as CourseType
      accommodation.value = trip.accommodation as Accommodation
      activities.value = (trip.activities || []) as ActivityId[]
      savedAt.value = trip.created_at
      lastSavedTripId.value = trip.trip_id
      return true
    }

    async function getAuthUser() {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user?.id) return null
      return data.user
    }

    /** Resolve destination_id via useDestinations (never insert a duplicate city) */
    async function resolveDestinationId(catalogDestinationId: string) {
      const { destinations, fetchDestinations, findDestinationById } = useDestinations()

      if (!destinations.value.length) {
        await fetchDestinations()
      }

      const found = findDestinationById(catalogDestinationId)
      if (!found?.destination_id) {
        throw new Error(`Destination "${catalogDestinationId}" was not found in destinations. Run relational_schema.sql.`)
      }
      return found.destination_id
    }

    /** Delegates to useTrips composable, then mirrors into this store */
    async function fetchMyTrips(sortByPrice: 'asc' | 'desc' | 'newest' = 'newest') {
      const { trips, fetchTrips, error } = useTrips()

      isSyncing.value = true
      syncError.value = ''

      const data = await fetchTrips(sortByPrice)

      savedTrips.value = data
      syncError.value = error.value
      isSyncing.value = false

      return savedTrips.value
    }

    async function loadFromDatabase() {
      const trips = await fetchMyTrips('newest')
      if (!trips.length) return false
      return applyLatestTripToForm(trips[0])
    }

    /** Ask the Nuxt server API for the authoritative total (falls back to client calc) */
    async function calculateServerPrice() {
      if (!durationWeeks.value || !courseType.value || !accommodation.value) {
        return totalPrice.value
      }

      try {
        const result = await $fetch<{ total: number }>('/api/calculate-price', {
          method: 'POST',
          body: {
            duration: durationWeeks.value,
            courseType: courseType.value,
            accommodation: accommodation.value,
            activities: activities.value,
          },
        })
        return result.total
      }
      catch {
        return totalPrice.value
      }
    }

    async function saveTrip() {
      if (!isComplete.value) return false

      const supabase = useSupabaseClient()
      const authUser = await getAuthUser()
      if (!authUser) {
        syncError.value = 'You must be logged in to save your trip.'
        return false
      }

      isSyncing.value = true
      syncError.value = ''

      try {
        // Ensure profile exists (FK user_id -> profiles.user_id)
        await useUserStore().ensureProfile()

        // 1) authenticated user_id
        const userId = authUser.id

        // 2) destination_id from destinations table (reuse existing row)
        const resolvedDestinationId = await resolveDestinationId(destinationId.value)

        // 3) total from server API (same rates; no secrets)
        const serverTotal = await calculateServerPrice()

        // 4) INSERT a NEW trip row (never overwrite previous trips)
        const { data, error } = await supabase
          .from('trips')
          .insert({
            user_id: userId,
            destination_id: resolvedDestinationId,
            duration: durationWeeks.value,
            course_type: courseType.value,
            accommodation: accommodation.value,
            activities: activities.value,
            total_price: serverTotal,
          })
          .select('trip_id, created_at')
          .single()

        if (error) {
          syncError.value = error.message
          isSyncing.value = false
          return false
        }

        savedAt.value = data.created_at
        lastSavedTripId.value = data.trip_id
        await fetchMyTrips('newest')
        isSyncing.value = false
        return true
      }
      catch (err) {
        syncError.value = err instanceof Error ? err.message : 'Could not save trip.'
        isSyncing.value = false
        return false
      }
    }

    function resetTrip() {
      language.value = ''
      destinationId.value = ''
      durationWeeks.value = null
      courseType.value = ''
      accommodation.value = ''
      activities.value = []
      savedAt.value = null
      lastSavedTripId.value = null
      syncError.value = ''
    }

    function clearSavedTrips() {
      savedTrips.value = []
      useTrips().clearTrips()
    }

    return {
      language,
      destinationId,
      durationWeeks,
      courseType,
      accommodation,
      activities,
      savedAt,
      lastSavedTripId,
      syncError,
      isSyncing,
      savedTrips,
      availableDestinations,
      destination,
      coursePrice,
      accommodationPrice,
      activitiesPrice,
      totalPrice,
      hasAnySelection,
      validationErrors,
      isComplete,
      hasSavedTrip,
      latestSavedTrip,
      setLanguage,
      toggleActivity,
      fetchMyTrips,
      loadFromDatabase,
      saveTrip,
      resetTrip,
      clearSavedTrips,
    }
  },
  {
    persist: {
      pick: [
        'language',
        'destinationId',
        'durationWeeks',
        'courseType',
        'accommodation',
        'activities',
        'savedAt',
        'lastSavedTripId',
      ],
    },
  },
)
