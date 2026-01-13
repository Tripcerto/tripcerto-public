import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const registerInterest = async (name: string, email: string) => {
  const functionUrl = process.env.NEXT_PUBLIC_EDGE_FUNCTION_URL || ''

  const response = await fetch(`${functionUrl}/register-interest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to register interest')
  }

  return data
}
