export type Language = 'English' | 'Spanish' | 'French' | 'German'
export type CourseType = 'Standard' | 'Intensive'
export type Accommodation = 'Host Family' | 'Student Residence' | 'No Accommodation'
export type ActivityId = 'museums' | 'sports' | 'cultural' | 'evening' | 'tours'

export interface Destination {
  id: string
  city: string
  country: string
  label: string
  description: string
  duration: string
  image: string
  alt: string
}

export interface CourseDetail {
  slug: string
  name: Language
  level: string
  tagline: string
  description: string
  highlights: string[]
  modules: string[]
  exams: string[]
  weeklyHours: { Standard: string; Intensive: string }
  image: string
  alt: string
}

export const LANGUAGES: Language[] = ['English', 'Spanish', 'French', 'German']

export const DESTINATIONS_BY_LANGUAGE: Record<Language, Destination[]> = {
  English: [
    {
      id: 'london',
      city: 'London',
      country: 'United Kingdom',
      label: 'London, United Kingdom',
      description: 'Study in the heart of the UK capital: museums, markets, and everyday English all around you.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      alt: 'London Tower Bridge and skyline',
    },
    {
      id: 'edinburgh',
      city: 'Edinburgh',
      country: 'United Kingdom',
      label: 'Edinburgh, United Kingdom',
      description: 'Castles, festivals, and clear Scottish English — practice in a compact, walkable capital.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
      alt: 'Edinburgh castle and old town',
    },
    {
      id: 'dublin',
      city: 'Dublin',
      country: 'Ireland',
      label: 'Dublin, Ireland',
      description: 'Friendly streets, literature, and Irish English in pubs, parks, and campus life.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1549918864-48aa873aa9c0?auto=format&fit=crop&w=1200&q=80',
      alt: 'Dublin city and river',
    },
    {
      id: 'new-york',
      city: 'New York',
      country: 'United States',
      label: 'New York, United States',
      description: 'Fast-paced American English in the city that never sleeps — culture, media, and networking.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      alt: 'New York City skyline',
    },
  ],
  Spanish: [
    {
      id: 'madrid',
      city: 'Madrid',
      country: 'Spain',
      label: 'Madrid, Spain',
      description: 'Sunlit plazas, tapas evenings, and Spanish classes that spill into real conversations.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
      alt: 'Madrid city view',
    },
    {
      id: 'barcelona',
      city: 'Barcelona',
      country: 'Spain',
      label: 'Barcelona, Spain',
      description: 'Architecture, beach life, and Spanish (plus Catalan vibes) in a Mediterranean hub.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
      alt: 'Barcelona Sagrada Familia',
    },
    {
      id: 'seville',
      city: 'Seville',
      country: 'Spain',
      label: 'Seville, Spain',
      description: 'Andalusian warmth, flamenco nights, and southern Spanish you hear on every corner.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1558642084-fd27fae9a7f0?auto=format&fit=crop&w=1200&q=80',
      alt: 'Seville plaza and architecture',
    },
    {
      id: 'buenos-aires',
      city: 'Buenos Aires',
      country: 'Argentina',
      label: 'Buenos Aires, Argentina',
      description: 'Latin American Spanish, tango culture, and café life in a vibrant capital.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1200&q=80',
      alt: 'Buenos Aires colorful street',
    },
  ],
  French: [
    {
      id: 'paris',
      city: 'Paris',
      country: 'France',
      label: 'Paris, France',
      description: 'Cafés, galleries, and French spoken on every corner — practice beyond the classroom.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      alt: 'Eiffel Tower in Paris',
    },
    {
      id: 'lyon',
      city: 'Lyon',
      country: 'France',
      label: 'Lyon, France',
      description: 'Food capital energy, riverside walks, and clear French in a student-friendly city.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1524396309943-e03f5249f002?auto=format&fit=crop&w=1200&q=80',
      alt: 'Lyon city and river',
    },
    {
      id: 'bordeaux',
      city: 'Bordeaux',
      country: 'France',
      label: 'Bordeaux, France',
      description: 'Wine country charm, elegant streets, and immersive French with a southern pace.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1588416499018-d8c621e7d2c2?auto=format&fit=crop&w=1200&q=80',
      alt: 'Bordeaux historic center',
    },
    {
      id: 'montreal',
      city: 'Montreal',
      country: 'Canada',
      label: 'Montreal, Canada',
      description: 'North American French with a bilingual twist — festivals, neighborhoods, and campus life.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1519178614-68673b201f36?auto=format&fit=crop&w=1200&q=80',
      alt: 'Montreal city skyline',
    },
  ],
  German: [
    {
      id: 'berlin',
      city: 'Berlin',
      country: 'Germany',
      label: 'Berlin, Germany',
      description: 'A creative capital where German history, design, and daily life sharpen your skills.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80',
      alt: 'Berlin Brandenburg Gate',
    },
    {
      id: 'munich',
      city: 'Munich',
      country: 'Germany',
      label: 'Munich, Germany',
      description: 'Bavarian culture, parks, and professional German in a polished southern hub.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1528728329032-2972fddc2d67?auto=format&fit=crop&w=1200&q=80',
      alt: 'Munich Frauenkirche and city center',
    },
    {
      id: 'vienna',
      city: 'Vienna',
      country: 'Austria',
      label: 'Vienna, Austria',
      description: 'Classical music, cafés, and Austrian German in an elegant imperial city.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80',
      alt: 'Vienna historic architecture',
    },
    {
      id: 'zurich',
      city: 'Zurich',
      country: 'Switzerland',
      label: 'Zurich, Switzerland',
      description: 'Lake views, international atmosphere, and Swiss German exposure with high-quality courses.',
      duration: '1–4 weeks',
      image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1200&q=80',
      alt: 'Zurich lake and city',
    },
  ],
}

/** Default trips grid before a personalized trip is saved */
export const DEFAULT_TRIP_PREVIEWS = [
  DESTINATIONS_BY_LANGUAGE.English[0],
  DESTINATIONS_BY_LANGUAGE.Spanish[0],
  DESTINATIONS_BY_LANGUAGE.French[0],
  DESTINATIONS_BY_LANGUAGE.German[0],
]

export const COURSES_BY_LANGUAGE: Record<Language, CourseDetail> = {
  English: {
    slug: 'english',
    name: 'English',
    level: 'A1 → C1',
    tagline: 'Global communication, exams & travel English',
    description:
      'From everyday conversation to academic writing. Prepare for international studies, internships, and travel with confidence — then put it into practice on your immersion stay.',
    highlights: [
      'Conversation & pronunciation labs',
      'Business English option',
      'IELTS / TOEFL prep available',
    ],
    modules: [
      'Spoken fluency & listening labs',
      'Academic writing & presentations',
      'Media English & current affairs',
      'Travel & workplace scenarios',
    ],
    exams: ['IELTS', 'TOEFL', 'Cambridge B2 First / C1 Advanced'],
    weeklyHours: { Standard: '15 hours / week', Intensive: '25 hours / week' },
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    alt: 'English language classroom',
  },
  Spanish: {
    slug: 'spanish',
    name: 'Spanish',
    level: 'A1 → C1',
    tagline: 'European & Latin American Spanish tracks',
    description:
      'Discover the rhythms of Spanish through interactive lessons, cultural workshops, and real-world speaking practice tailored to your chosen destination.',
    highlights: [
      'Latin American & European variants',
      'Culture & cinema workshops',
      'Small group classes',
    ],
    modules: [
      'Conversation & pronunciation (Castilian / LatAm options)',
      'Grammar in context',
      'Film, music & regional culture',
      'Street Spanish for travel & stays',
    ],
    exams: ['DELE', 'SIELE'],
    weeklyHours: { Standard: '15 hours / week', Intensive: '25 hours / week' },
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    alt: 'Barcelona city view with Sagrada Familia',
  },
  French: {
    slug: 'french',
    name: 'French',
    level: 'A1 → C1',
    tagline: 'From first phrases to fluent discussion',
    description:
      'Master French grammar and nuance with teachers who guide you toward confident conversation — ideal preparation before Paris, Lyon, Bordeaux or Montreal.',
    highlights: [
      'DELF / DALF preparation',
      'Literature & media modules',
      'Conversation clubs',
    ],
    modules: [
      'Oral interaction & phonetics',
      'Written expression & structure',
      'French media & everyday culture',
      'Francophone worlds (Europe & Canada)',
    ],
    exams: ['DELF', 'DALF', 'TCF'],
    weeklyHours: { Standard: '15 hours / week', Intensive: '25 hours / week' },
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    alt: 'Parisian street scene for French learning',
  },
  German: {
    slug: 'german',
    name: 'German',
    level: 'A1 → C1',
    tagline: 'Structured path for studies & careers in Europe',
    description:
      'Build solid foundations in German — ideal for studies, careers in Europe, and your stay in Berlin, Munich, Vienna or Zurich.',
    highlights: [
      'Clear structure & grammar track',
      'Professional German option',
      'Goethe-Institut exam prep',
    ],
    modules: [
      'Grammar foundations & case system',
      'Speaking confidence workshops',
      'Professional & academic German',
      'Regional varieties (DE / AT / CH awareness)',
    ],
    exams: ['Goethe-Zertifikat', 'TestDaF', 'ÖSD'],
    weeklyHours: { Standard: '15 hours / week', Intensive: '25 hours / week' },
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
    alt: 'German city architecture',
  },
}

export const DEFAULT_COURSES = LANGUAGES.map(lang => COURSES_BY_LANGUAGE[lang])

export const DURATIONS = [1, 2, 3, 4] as const

export const COURSE_TYPES: CourseType[] = ['Standard', 'Intensive']

export const ACCOMMODATIONS: Accommodation[] = [
  'Host Family',
  'Student Residence',
  'No Accommodation',
]

export const ACTIVITIES: { id: ActivityId; label: string; price: number }[] = [
  { id: 'museums', label: 'Museums', price: 40 },
  { id: 'sports', label: 'Sports', price: 50 },
  { id: 'cultural', label: 'Cultural Activities', price: 60 },
  { id: 'evening', label: 'Evening Outings', price: 45 },
  { id: 'tours', label: 'City Tours', price: 35 },
]

/** Weekly rates in euros */
export const COURSE_WEEKLY: Record<CourseType, number> = {
  Standard: 200,
  Intensive: 250,
}

export const ACCOMMODATION_WEEKLY: Record<Accommodation, number> = {
  'Host Family': 180,
  'Student Residence': 200,
  'No Accommodation': 0,
}

export function findDestination(language: Language | '', destinationId: string) {
  if (!language || !destinationId) return null
  return DESTINATIONS_BY_LANGUAGE[language].find(d => d.id === destinationId) ?? null
}

export function formatEuro(amount: number) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}
