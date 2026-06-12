/**
 * 링크 OG 메타 파싱 — Supabase Edge Function `fetch-place-info`
 * 
 * 역할:
 * 사용자가 입력한 링크(URL)를 Supabase Edge Function으로 전달하고
 * 식당 이름 / 주소 / 이미지 정보를 받아오는 함수
 * * 흐름: 
 * * React 
 * * ↓ 
 * * fetchPlaceInfo() 
 * * ↓ 
 * * Supabase Edge Function (fetch-place-info) 
 * * ↓ 
 * * 외부 링크(네이버 지도 등) 접속 
 * * ↓ 
 * * OG 파싱 
 * * ↓ 
 * * 결과 반환
 */

export interface PlaceMeta {
  name: string
  address: string
  imageUrl: string
}
// .env 파일에서 환경 변수 가져오기 (Supabase URL, 인증 키)
function getSupabaseConfig(): { url: string; key: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  if (!url || !key) return null
  return { url, key }
}

/** curl과 동일한 방식으로 Edge Function 호출 */
async function invokeFetchPlaceInfo(link: string): Promise<PlaceMeta | null> {
  const config = getSupabaseConfig()
  if (!config) {
    console.error('fetchPlaceInfo: missing VITE_SUPABASE_* env')
    return null
  }
  // Supabase Edge Function 요청
  const res = await fetch(`${config.url}/functions/v1/fetch-place-info`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.key}`,
      apikey: config.key,
      'Content-Type': 'application/json',
    },
    // 전달할 데이터
    body: JSON.stringify({ url: link }),
  })
  // HTTP 실패 처리
  if (!res.ok) {
    console.error('fetchPlaceInfo HTTP', res.status, await res.text())
    return null
  }
  // 응답 JSON 파싱
  const data = (await res.json()) as PlaceMeta & { error?: string }

  // 에러 처리
  if (data.error) {
    console.error('fetchPlaceInfo', data.error)
    return null
  }
  // 결과 반환
  return {
    name: data.name ?? '',
    address: data.address ?? '',
    imageUrl: data.imageUrl ?? '',
  }
}

// 외부에서 사용하는 함수
// URL 전달 -> 장소 메타 정보 반환
export async function fetchPlaceInfo(url: string): Promise<PlaceMeta | null> {
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    // Supabase Edge Function 호출
    return await invokeFetchPlaceInfo(trimmed)
  } catch (e) {
    // 네트워크/예외 처리
    console.error('fetchPlaceInfo', e)
    return null
  }
}
