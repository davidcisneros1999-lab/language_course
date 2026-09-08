<template>
  <div>
    <section class="relative min-h-[50vh] overflow-hidden bg-ink text-white">
      <img
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80"
        alt="Students collaborating at Horizons"
        class="absolute inset-0 h-full w-full object-cover opacity-60"
      >
      <div class="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/30" />
      <div class="relative mx-auto flex min-h-[50vh] max-w-6xl flex-col justify-end px-5 pb-14 pt-24 md:px-8">
        <p class="font-display text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
          Our school
        </p>
        <h1 class="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl">
          About Horizons
        </h1>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div class="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <div>
          <h2 class="font-display text-3xl font-bold text-ink">
            Learning that travels with you
          </h2>
          <p class="mt-5 text-lg leading-relaxed text-muted-foreground">
            Horizons is a language school created for students who want more than textbooks.
            We combine solid classroom teaching with linguistic stays abroad, so every word you learn
            finds a place in real life.
          </p>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            Our teachers are experienced native speakers. Our trips are carefully organised —
            accommodation, local classes, and cultural activities included — so you can focus on
            growing your confidence.
          </p>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            Whether you aim for university exchange, an internship abroad, or simply the joy of
            speaking another language, we help you take the next step.
          </p>
        </div>

        <aside class="space-y-8 border-l-0 border-ink/10 md:border-l md:pl-10">
          <div>
            <p class="font-display text-4xl font-bold text-sea">4</p>
            <p class="mt-1 font-display font-semibold text-ink">Languages taught</p>
            <p class="text-sm text-muted-foreground">English, Spanish, French, German</p>
          </div>
          <div>
            <p class="font-display text-4xl font-bold text-sea">4</p>
            <p class="mt-1 font-display font-semibold text-ink">Destination cities</p>
            <p class="text-sm text-muted-foreground">London, Madrid, Paris, Berlin</p>
          </div>
          <div>
            <p class="font-display text-4xl font-bold text-sea">A1–C1</p>
            <p class="mt-1 font-display font-semibold text-ink">CEFR levels</p>
            <p class="text-sm text-muted-foreground">From first words to fluency</p>
          </div>
        </aside>
      </div>

      <div class="mt-20">
        <NuxtLink
          to="/contact"
          class="inline-flex bg-sea px-6 py-3.5 font-display text-base font-semibold text-white transition hover:bg-ink"
        >
          Contact / Apply
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({ title: 'About Us — Horizons' })
</script>
