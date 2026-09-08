<template>
  <div class="border border-destructive/40 bg-destructive/5 px-6 py-8">
    <p class="font-display text-sm font-semibold uppercase tracking-[0.18em] text-destructive">
      Invalid form
    </p>
    <ul class="mt-4 space-y-2 text-left text-ink/85">
      <li v-for="error in errors" :key="error" class="flex gap-2">
        <span class="text-destructive" aria-hidden="true">•</span>
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  errors: {
    type: Array,
    default: () => [],
  },
})
</script>
