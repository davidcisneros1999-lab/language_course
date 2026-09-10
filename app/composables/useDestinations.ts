import type { Database } from '~/types/database.types'

export type DestinationRow = Database['public']['Tables']['destinations']['Row']

/** Shared state so store + pages reuse the same destinations cache */
const destinations = ref<DestinationRow[]>([])
const loading = ref(false)
const error = ref('')

/**
 * Fetch all destinations from Supabase (public catalog table).
 * Used by Build Trip and by tripBuilder when resolving destination_id.
 */
export function useDestinations() {
  const supabase = useSupabaseClient()

  async function fetchDestinations() {
    loading.value = true
    error.value = ''

    const { data, error: queryError } = await supabase
      .from('destinations')
      .select('destination_id, city, country, language, description, image, weekly_course_price, created_at')
      .order('city', { ascending: true })

    loading.value = false

    if (queryError) {
      error.value = queryError.message
      destinations.value = []
      return []
    }

    destinations.value = (data || []) as DestinationRow[]
    return destinations.value
  }

  function findDestinationById(destinationId: string) {
    return destinations.value.find(d => d.destination_id === destinationId) || null
  }

  function destinationsByLanguage(language: string) {
    return destinations.value.filter(d => d.language === language)
  }

  return {
    destinations,
    loading,
    error,
    fetchDestinations,
    findDestinationById,
    destinationsByLanguage,
  }
}
