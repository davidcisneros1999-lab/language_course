<template>
  <div class="border border-dashed border-ink/25 bg-mist/30 px-6 py-10 text-center">
    <p class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sea">
      {{ title }}
    </p>
    <p class="mt-3 text-lg text-muted-foreground">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Empty state',
  },
  message: {
    type: String,
    default: 'No information yet. Fill in the form to continue.',
  },
})
</script>
