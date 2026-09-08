<template>
  <div>
    <section class="border-b border-ink/10 bg-mist/40">
      <div class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p class="font-display text-sm font-semibold uppercase tracking-[0.22em] text-sea">
          Programs
        </p>
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Language Courses
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-muted-foreground">
          Structured classes led by native-speaking teachers. Choose the language that opens your next horizon.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div class="space-y-20">
        <article
          v-for="(course, i) in courses"
          :key="course.slug"
          class="grid items-center gap-8 md:grid-cols-2 md:gap-14"
          :class="i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''"
        >
          <div class="overflow-hidden">
            <img
              :src="course.image"
              :alt="course.alt"
              class="aspect-[4/3] w-full object-cover"
            >
          </div>
          <div>
            <p class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sea">
              {{ course.level }}
            </p>
            <h2 class="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">
              {{ course.name }}
            </h2>
            <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
              {{ course.description }}
            </p>
            <ul class="mt-6 space-y-2 text-ink/80">
              <li v-for="item in course.highlights" :key="item" class="flex gap-2">
                <span class="text-sea" aria-hidden="true">—</span>
                {{ item }}
              </li>
            </ul>
            <NuxtLink
              to="/contact"
              class="mt-8 inline-flex bg-sea px-5 py-3 font-display text-sm font-semibold text-white transition hover:bg-ink"
            >
              Apply for {{ course.name }}
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({ title: 'Language Courses — Horizons' })

const courses = [
  {
    slug: 'english',
    name: 'English',
    level: 'A1 → C1',
    description:
      'From everyday conversation to academic writing. Prepare for international studies, internships, and travel with confidence.',
    highlights: ['Conversation & pronunciation labs', 'Business English option', 'IELTS / TOEFL prep available'],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    alt: 'English language classroom',
  },
  {
    slug: 'spanish',
    name: 'Spanish',
    level: 'A1 → C1',
    description:
      'Discover the rhythms of Spanish through interactive lessons, cultural workshops, and real-world speaking practice.',
    highlights: ['Latin American & European variants', 'Culture & cinema workshops', 'Small group classes'],
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    alt: 'Barcelona city view with Sagrada Familia',
  },
  {
    slug: 'french',
    name: 'French',
    level: 'A1 → C1',
    description:
      'Master French grammar and nuance with teachers who guide you from first phrases to fluent discussion.',
    highlights: ['DELF / DALF preparation', 'Literature & media modules', 'Conversation clubs'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    alt: 'Parisian street scene for French learning',
  },
  {
    slug: 'german',
    name: 'German',
    level: 'A1 → C1',
    description:
      'Build solid foundations in German — ideal for studies, careers in Europe, and your stay in Berlin.',
    highlights: ['Clear structure & grammar track', 'Professional German option', 'Goethe-Institut exam prep'],
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
    alt: 'German city architecture',
  },
]
</script>
