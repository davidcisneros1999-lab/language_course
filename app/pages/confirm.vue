<template>
  <div class="mx-auto max-w-6xl px-5 py-24 md:px-8">
    <p class="font-display text-sm font-semibold uppercase tracking-[0.22em] text-sea">
      Authentication
    </p>
    <h1 class="mt-3 font-display text-3xl font-bold text-ink">
      Confirming your session…
    </h1>
    <p class="mt-4 text-muted-foreground">
      Please wait while we finish signing you in.
    </p>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
const router = useRouter()

watch(user, (value) => {
  if (value) {
    router.replace('/build-trip')
  }
}, { immediate: true })
</script>
