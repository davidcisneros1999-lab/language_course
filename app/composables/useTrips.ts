import type { SavedTripRow } from '~/types/database.types'
import type { Accommodation, ActivityId, CourseType } from '~/data/tripCatalog'

export type TripSortMode = 'asc' | 'desc' | 'newest'

export type TripUpdatePayload = {
  duration: number
  courseType: CourseType | string
  accommodation: Accommodation | string
  activities?: ActivityId[] | string[]
}

/** Shared state so My Trips + tripBuilder reuse the same trips list */
const trips = ref<SavedTripRow[]>([])
const loading = ref(false)
const error = ref('')

/**
 * Fetch authenticated user's saved trips from Supabase,
 * joined with destinations via foreign key.
 * Also exposes updateTrip / deleteTrip for full CRUD.
 */
export function useTrips() {
  const supabase = useSupabaseClient()

  async function fetchTrips(sortByPrice: TripSortMode = 'newest') {
    loading.value = true
    error.value = ''

    const { data: authData, error: authError } = await supabase.auth.getUser()
    const authUser = authData.user

    if (authError || !authUser?.id) {
      loading.value = false
      error.value = authError?.message || 'You must be logged in to load trips.'
      trips.value = []
      return []
    }

    let query = supabase
      .from('trips')
      .select(`
        trip_id,
        user_id,
        destination_id,
        duration,
        course_type,
        accommodation,
        activities,
        total_price,
        created_at,
        destinations (
          destination_id,
          city,
          country,
          language,
          description,
          image
        )
      `)
      .eq('user_id', authUser.id)

    if (sortByPrice === 'asc') {
      query = query.order('total_price', { ascending: true })
    }
    else if (sortByPrice === 'desc') {
      query = query.order('total_price', { ascending: false })
    }
    else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error: queryError } = await query

    loading.value = false

    if (queryError) {
      error.value = queryError.message
      trips.value = []
      return []
    }

    trips.value = (data || []) as SavedTripRow[]
    return trips.value
  }

  /**
   * Update an existing trip row by trip_id (never inserts a new row).
   * Recalculates total_price via the server API.
   */
  async function updateTrip(tripId: string, payload: TripUpdatePayload) {
    error.value = ''
    loading.value = true

    const activities = payload.activities || []

    let totalPrice: number
    try {
      const result = await $fetch<{ total: number }>('/api/calculate-price', {
        method: 'POST',
        body: {
          duration: payload.duration,
          courseType: payload.courseType,
          accommodation: payload.accommodation,
          activities,
        },
      })
      totalPrice = result.total
    }
    catch (err) {
      loading.value = false
      error.value = err instanceof Error ? err.message : 'Could not recalculate price.'
      return null
    }

    const { data, error: queryError } = await supabase
      .from('trips')
      .update({
        duration: payload.duration,
        course_type: payload.courseType,
        accommodation: payload.accommodation,
        total_price: totalPrice,
      })
      .eq('trip_id', tripId)
      .select(`
        trip_id,
        user_id,
        destination_id,
        duration,
        course_type,
        accommodation,
        activities,
        total_price,
        created_at,
        destinations (
          destination_id,
          city,
          country,
          language,
          description,
          image
        )
      `)
      .single()

    loading.value = false

    if (queryError) {
      error.value = queryError.message
      return null
    }

    const updated = data as SavedTripRow
    trips.value = trips.value.map(t => (t.trip_id === tripId ? updated : t))
    return updated
  }

  /** Delete only the trip matching trip_id */
  async function deleteTrip(tripId: string) {
    error.value = ''
    loading.value = true

    const { error: queryError } = await supabase
      .from('trips')
      .delete()
      .eq('trip_id', tripId)

    loading.value = false

    if (queryError) {
      error.value = queryError.message
      return false
    }

    trips.value = trips.value.filter(t => t.trip_id !== tripId)
    return true
  }

  function clearTrips() {
    trips.value = []
    error.value = ''
  }

  return {
    trips,
    loading,
    error,
    fetchTrips,
    updateTrip,
    deleteTrip,
    clearTrips,
  }
}
