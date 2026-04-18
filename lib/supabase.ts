import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://tcvbgaxdecarulgtnaml.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjdmJnYXhkZWNhcnVsZ3RuYW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0OTYyMDMsImV4cCI6MjA5MjA3MjIwM30.qvccJtW3axBFYUZbHXS9-xDA_yMobF7NYYtkrHeH_M4"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
