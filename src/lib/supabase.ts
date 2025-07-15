import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase project credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lzqxafromwbkctzatvqo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cXhhZnJvbXdia2N0emF0dnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NzA1ODEsImV4cCI6MjA2NzQ0NjU4MX0.R2RmJjudpkYhnG3tTpEJmR6_d7XjwGqdEIb30eoc1KM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      records: {
        Row: {
          id: string
          donor: string
          panels: string
          barcode: string
          source: string
          date: string
          amount: string
          observed_by: string
          status: string
          is_highlighted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          donor: string
          panels: string
          barcode: string
          source: string
          date: string
          amount: string
          observed_by: string
          status: string
          is_highlighted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          donor?: string
          panels?: string
          barcode?: string
          source?: string
          date?: string
          amount?: string
          observed_by?: string
          status?: string
          is_highlighted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Record = Database['public']['Tables']['records']['Row']
export type RecordInsert = Database['public']['Tables']['records']['Insert']
export type RecordUpdate = Database['public']['Tables']['records']['Update'] 
