export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          firstname: string | null
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          firstname?: string | null
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          firstname?: string | null
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      destinations: {
        Row: {
          destination_id: string
          city: string
          country: string
          language: string
          description: string | null
          image: string | null
          weekly_course_price: number
          created_at: string
        }
        Insert: {
          destination_id: string
          city: string
          country: string
          language: string
          description?: string | null
          image?: string | null
          weekly_course_price?: number
          created_at?: string
        }
        Update: {
          destination_id?: string
          city?: string
          country?: string
          language?: string
          description?: string | null
          image?: string | null
          weekly_course_price?: number
          created_at?: string
        }
      }
      trips: {
        Row: {
          trip_id: string
          user_id: string
          destination_id: string
          duration: number
          course_type: string
          accommodation: string
          activities: string[]
          total_price: number
          created_at: string
        }
        Insert: {
          trip_id?: string
          user_id: string
          destination_id: string
          duration: number
          course_type: string
          accommodation: string
          activities?: string[]
          total_price: number
          created_at?: string
        }
        Update: {
          trip_id?: string
          user_id?: string
          destination_id?: string
          duration?: number
          course_type?: string
          accommodation?: string
          activities?: string[]
          total_price?: number
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type SavedTripRow = Database['public']['Tables']['trips']['Row'] & {
  destinations: Pick<
    Database['public']['Tables']['destinations']['Row'],
    'destination_id' | 'city' | 'country' | 'language' | 'description' | 'image'
  > | null
}
