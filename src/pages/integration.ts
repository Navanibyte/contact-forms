
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ojhezyxnvfwazugsxdok.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaGV6eXhudmZ3YXp1Z3N4ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwODA0MzYsImV4cCI6MjA3ODY1NjQzNn0.9eaQyV0_14rBv5qj1k3ZGt5cD4E8a8YGoY0iAVS3alU"
const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase }