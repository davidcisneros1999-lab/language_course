<template>
  <div class="overflow-hidden border border-ink/10 bg-white">
    <div class="relative aspect-[21/9] overflow-hidden bg-ink">
      <img
        :src="content.image"
        :alt="content.alt"
        class="h-full w-full object-cover opacity-80"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
      <div class="absolute bottom-0 left-0 p-6 text-white">
        <p class="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Saved preference
        </p>
        <h3 class="mt-1 font-display text-2xl font-bold md:text-3xl">
          {{ content.title }}
        </h3>
      </div>
    </div>
    <div class="px-6 py-6">
      <p class="text-lg text-muted-foreground">
        {{ content.description }}
      </p>
      <NuxtLink
        :to="content.link"
        class="mt-5 inline-flex bg-sea px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-ink"
      >
        {{ content.cta }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  language: {
    type: String,
    required: true,
  },
})

const catalog = {
  English: {
    title: 'English track',
    description: 'Courses and immersion in London — conversation, exams, and city life in English.',
    cta: 'See English courses',
    link: '/courses',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=80',
    alt: 'London',
  },
  French: {
    title: 'French track',
    description: 'Courses and a stay in Paris — cafés, culture, and everyday French practice.',
    cta: 'See French courses',
    link: '/courses',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80',
    alt: 'Paris',
  },
  Spanish: {
    title: 'Spanish track',
    description: 'Classes and a stay in Madrid — plazas, tapas, and real Spanish conversation.',
    cta: 'See Spanish trips',
    link: '/trips',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1400&q=80',
    alt: 'Madrid',
  },
  German: {
    title: 'German track',
    description: 'Courses and a stay in Berlin — daily life, culture, and German practice.',
    cta: 'See German trips',
    link: '/trips',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1400&q=80',
    alt: 'Berlin',
  },
}

const content = computed(() => catalog[props.language] || catalog.English)
</script>
