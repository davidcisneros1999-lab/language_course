<template>
  <div>
    <section class="border-b border-ink/10 bg-mist/40">
      <div class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p class="font-display text-sm font-semibold uppercase tracking-[0.22em] text-sea">
          Get in touch
        </p>
        <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Contact / Apply
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-muted-foreground">
          Tell us which course or trip interests you — we will get back to you with the next steps.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div class="grid gap-14 md:grid-cols-[1fr_0.85fr]">
        <form class="space-y-5" @submit.prevent="submit">
          <div v-if="sent" class="border border-sea/30 bg-sea/10 px-5 py-4 text-ink">
            Thank you! Your message has been recorded. (Demo form — no email is sent.)
          </div>

          <div>
            <label for="name" class="mb-1.5 block font-display text-sm font-semibold text-ink">
              Full name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full border border-ink/20 bg-white px-4 py-3 outline-none transition focus:border-sea focus:ring-2 focus:ring-sea/25"
              placeholder="Your name"
            >
          </div>

          <div>
            <label for="email" class="mb-1.5 block font-display text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full border border-ink/20 bg-white px-4 py-3 outline-none transition focus:border-sea focus:ring-2 focus:ring-sea/25"
              placeholder="you@email.com"
            >
          </div>

          <div>
            <label for="interest" class="mb-1.5 block font-display text-sm font-semibold text-ink">
              Interest
            </label>
            <select
              id="interest"
              v-model="form.interest"
              required
              class="w-full border border-ink/20 bg-white px-4 py-3 outline-none transition focus:border-sea focus:ring-2 focus:ring-sea/25"
            >
              <option value="" disabled>Select a program</option>
              <optgroup label="Language Courses">
                <option>English course</option>
                <option>Spanish course</option>
                <option>French course</option>
                <option>German course</option>
              </optgroup>
              <optgroup label="Language Trips">
                <option>Trip — London</option>
                <option>Trip — Madrid</option>
                <option>Trip — Paris</option>
                <option>Trip — Berlin</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label for="message" class="mb-1.5 block font-display text-sm font-semibold text-ink">
              Message
            </label>
            <textarea
              id="message"
              v-model="form.message"
              rows="4"
              class="w-full resize-y border border-ink/20 bg-white px-4 py-3 outline-none transition focus:border-sea focus:ring-2 focus:ring-sea/25"
              placeholder="Tell us briefly about your level and goals…"
            />
          </div>

          <button
            type="submit"
            class="bg-sea px-6 py-3.5 font-display text-base font-semibold text-white transition hover:bg-ink"
          >
            Send application
          </button>
        </form>

        <aside>
          <h2 class="font-display text-2xl font-bold text-ink">
            Visit or write
          </h2>
          <dl class="mt-6 space-y-5 text-muted-foreground">
            <div>
              <dt class="font-display text-sm font-semibold text-ink">Address</dt>
              <dd class="mt-1">12 Rue des Langues, 75005 Paris</dd>
            </div>
            <div>
              <dt class="font-display text-sm font-semibold text-ink">Email</dt>
              <dd class="mt-1">
                <a href="mailto:hello@horizons-school.edu" class="text-sea hover:underline">
                  hello@horizons-school.edu
                </a>
              </dd>
            </div>
            <div>
              <dt class="font-display text-sm font-semibold text-ink">Phone</dt>
              <dd class="mt-1">+33 1 23 45 67 89</dd>
            </div>
            <div>
              <dt class="font-display text-sm font-semibold text-ink">Hours</dt>
              <dd class="mt-1">Mon–Fri · 9:00–18:00</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({ title: 'Contact / Apply — Horizons' })

const form = reactive({
  name: '',
  email: '',
  interest: '',
  message: '',
})

const sent = ref(false)

function submit() {
  sent.value = true
  form.name = ''
  form.email = ''
  form.interest = ''
  form.message = ''
}
</script>
