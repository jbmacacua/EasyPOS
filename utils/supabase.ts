// Base
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "https://uvhbiqrgjfklphcwcxqa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2aGJpcXJnamZrbHBoY3djeHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NDU4NTAsImV4cCI6MjA0ODUyMTg1MH0.Upidie78d18cn1iX5LdIvaiKM7kKB18nxLsgUKkMlrg",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
