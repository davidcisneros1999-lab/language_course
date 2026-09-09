import { defineStore } from 'pinia'

function isValidFirstName(value = '') {
  const name = value.trim()
  if (!name) return false
  if (name.includes('@')) return false
  return name.length >= 2
}

export const useUserStore = defineStore(
  'user',
  () => {
    const supabase = useSupabaseClient()
    const supabaseUser = useSupabaseUser()

    const firstName = ref('')

    const isConnected = computed(() => Boolean(supabaseUser.value))
    const email = computed(() => supabaseUser.value?.email || '')
    const id = computed(() => supabaseUser.value?.id || '')

    const displayName = computed(() => {
      if (!isConnected.value) return ''
      return isValidFirstName(firstName.value) ? firstName.value.trim() : ''
    })

    async function loadProfile() {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      const authUser = authData.user
      if (authError || !authUser?.id) {
        firstName.value = ''
        return { error: authError }
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('firstname')
        .eq('user_id', authUser.id)
        .maybeSingle()

      if (error) return { error }

      if (data?.firstname && isValidFirstName(data.firstname)) {
        firstName.value = data.firstname.trim()
      }

      return { error: null, data }
    }

    async function ensureProfile(firstname?: string) {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      const authUser = authData.user
      if (authError || !authUser?.id) return { error: authError }

      const cleanFirstName = (firstname || firstName.value || '').trim()
      if (isValidFirstName(cleanFirstName)) {
        firstName.value = cleanFirstName
      }

      const payload = {
        user_id: authUser.id,
        email: authUser.email || '',
        firstname: isValidFirstName(firstName.value) ? firstName.value : null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('profiles').upsert(payload, {
        onConflict: 'user_id',
      })

      return { error }
    }

    async function signUp(payload: { email: string; password: string; firstName: string }) {
      const clean = payload.firstName.trim()
      firstName.value = clean

      const { data, error } = await supabase.auth.signUp({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        options: {
          data: {
            firstname: clean,
          },
        },
      })

      if (!error && data.user) {
        await ensureProfile(clean)
      }

      return { data, error }
    }

    async function signIn(payload: { email: string; password: string; firstName?: string }) {
      const clean = payload.firstName?.trim() || ''
      if (isValidFirstName(clean)) {
        firstName.value = clean
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      })

      if (!error && data.user) {
        if (isValidFirstName(clean)) {
          await ensureProfile(clean)
        }
        else {
          await ensureProfile()
          await loadProfile()
        }
      }

      return { data, error }
    }

    async function disconnect() {
      const trip = useTripBuilderStore()
      const { error } = await supabase.auth.signOut()
      firstName.value = ''
      trip.resetTrip()
      trip.clearSavedTrips()
      return { error }
    }

    return {
      id,
      email,
      firstName,
      displayName,
      isConnected,
      loadProfile,
      ensureProfile,
      signUp,
      signIn,
      disconnect,
    }
  },
  {
    persist: {
      pick: ['firstName'],
    },
  },
)
