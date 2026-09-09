<template>
  <div class="default-layout min-h-screen flex flex-col">
    <TheNavbar />
    <main class="flex-auto">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
const user = useUserStore()
const trip = useTripBuilderStore()
const supabaseUser = useSupabaseUser()

if (user.firstName?.includes('@')) {
  user.firstName = ''
}

watch(
  supabaseUser,
  async (value) => {
    if (value) {
      await user.loadProfile()
      await trip.loadFromDatabase()
    }
    else {
      user.firstName = ''
      trip.clearSavedTrips()
    }
  },
  { immediate: true },
)
</script>
