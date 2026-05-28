/**
 * 네이버 지도 링크 OG 메타 파싱 (2차 기능)
 * 브라우저 CORS 제한으로 MVP에서는 미사용.
 * 추후 Vercel Serverless / Supabase Edge Function에서 호출 예정.
 */
export interface PlaceMeta {
  name: string
  address: string
  imageUrl: string
}

export async function fetchPlaceInfo(_url: string): Promise<PlaceMeta | null> {
  return null
}
