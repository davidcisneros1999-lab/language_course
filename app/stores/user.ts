import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    const firstName = ref('')
    const preferredLanguage = ref('')

    const isConnected = computed(
      () => firstName.value.trim().length > 0 && preferredLanguage.value.length > 0,
    )

    function connect(payload: { firstName: string; preferredLanguage: string }) {
      firstName.value = payload.firstName.trim()
      preferredLanguage.value = payload.preferredLanguage
    }

    function disconnect() {
      firstName.value = ''
      preferredLanguage.value = ''
    }

    return {
      firstName,
      preferredLanguage,
      isConnected,
      connect,
      disconnect,
    }
  },
  {
    // Keep first name + preference after page reload (localStorage via Nuxt module)
    persist: {
      pick: ['firstName', 'preferredLanguage'],
    },
  },
)
