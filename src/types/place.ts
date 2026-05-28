/** Supabase `places` 테이블 행 */
export interface Place {
  id: number
  room_id: string
  url: string
  name: string
  address: string
  image_url: string
  likes: number
  poster_name: string
  poster_char: string
  created_at?: string
}

/** 장소 추가 시 전달하는 입력 */
export interface AddPlaceInput {
  roomId: string
  url: string
  imageUrl: string
  posterName: string
  posterChar: string
}
