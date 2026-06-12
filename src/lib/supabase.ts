/**
 * Supabase 클라이언트 싱글톤
 * 환경 변수: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (.env)
 */
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn(
    'Supabase env missing. Copy .env.example to .env and set VITE_SUPABASE_*',
  )
}

export const supabase = createClient(url ?? '', key ?? '')
