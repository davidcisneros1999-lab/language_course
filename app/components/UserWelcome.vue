<template>
  <div class="border border-sea/30 bg-sea/10 px-6 py-8">
    <p class="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sea">
      Welcome
    </p>
    <h2 class="mt-2 font-display text-3xl font-bold text-ink">
      Hello, {{ firstName }}!
    </h2>
    <p class="mt-3 text-muted-foreground">
      Your first name is shared via the Pinia store — it also appears in the navigation bar.
    </p>
  </div>
</template>

<script setup>
defineProps({
  firstName: {
    type: String,
    required: true,
  },
})
</script>
