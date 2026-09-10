import { createHmac } from 'node:crypto'
import {
  type Accommodation,
  type ActivityId,
  type CourseType,
  ACCOMMODATION_WEEKLY,
  ACTIVITIES,
  COURSE_WEEKLY,
} from '~/data/tripCatalog'

type CalculatePriceBody = {
  duration?: number
  courseType?: CourseType | string
  accommodation?: Accommodation | string
  activities?: ActivityId[] | string[]
}

/**
 * POST /api/calculate-price
 * Body: { duration, courseType, accommodation, activities? }
 * Returns breakdown + total using the same rates as the trip builder.
 *
 * Uses server-only runtimeConfig.tripPricingSecret (from TRIP_PRICING_SECRET).
 * The secret itself is never returned to the client.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const pricingSecret = config.tripPricingSecret

  if (!pricingSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Trip pricing is not configured on the server.',
    })
  }

  const body = await readBody<CalculatePriceBody>(event)

  const duration = Number(body?.duration)
  const courseType = body?.courseType as CourseType | undefined
  const accommodation = body?.accommodation as Accommodation | undefined
  const activities = Array.isArray(body?.activities) ? body.activities : []

  if (!duration || duration < 1 || duration > 4) {
    throw createError({
      statusCode: 400,
      statusMessage: 'duration must be an integer between 1 and 4',
    })
  }

  if (!courseType || !(courseType in COURSE_WEEKLY)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'courseType must be Standard or Intensive',
    })
  }

  if (!accommodation || !(accommodation in ACCOMMODATION_WEEKLY)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'accommodation must be Host Family, Student Residence or No Accommodation',
    })
  }

  const course = COURSE_WEEKLY[courseType] * duration
  const lodging = ACCOMMODATION_WEEKLY[accommodation] * duration
  const activitiesTotal = activities.reduce((sum, id) => {
    const item = ACTIVITIES.find(a => a.id === id)
    return sum + (item?.price ?? 0)
  }, 0)

  const total = course + lodging + activitiesTotal

  // Sign the quote with the private secret (HMAC). Safe to return the hash;
  // the secret never leaves the server.
  const quoteSignature = createHmac('sha256', pricingSecret)
    .update([duration, courseType, accommodation, activities.join(','), total].join('|'))
    .digest('hex')

  return {
    currency: 'EUR',
    duration,
    courseType,
    accommodation,
    activities,
    breakdown: {
      course,
      accommodation: lodging,
      activities: activitiesTotal,
    },
    total,
    quoteSignature,
  }
})
