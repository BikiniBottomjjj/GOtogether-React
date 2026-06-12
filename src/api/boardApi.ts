/**
 * 방(rooms) 생성·조회 API
 * Supabase `rooms` 테이블
 */
import { supabase } from '../lib/supabase'
import type { Board } from '../types/board'

export async function createBoard(name: string): Promise<Board | null> {
  const { data, error } = await supabase
    .from('rooms')
    .insert({ name })
    .select()
    .single()

  if (error) {
    console.error('createBoard', error)
    return null
  }
  return data as Board
}

export async function getBoard(roomId: string): Promise<Board | null> {
  const { data, error } = await supabase
    .from('rooms')
    .select()
    .eq('id', roomId)
    .single()

  if (error) {
    console.error('getBoard', error)
    return null
  }
  return data as Board
}
