/**
 * **************************************************************
 * - 이 파일 전체가 서버 역할 "작은 벡엔드 서버"
 * - URL -> 장소 메타 정보 추출
 * **************************************************************
 * 네이버 지도 링크 OG 자동 파싱 — Supabase Edge Function `fetch-place-info`
 * 
 * 역할:
 * 사용자가 입력한 네이버 지도 링크(URL)를 Supabase Edge Function으로 전달하고
 * 식당 이름 / 주소 / 이미지 정보를 받아오는 함수
 * * 흐름: 
 * * React 
 * * ↓ 
 * * Supabase Edge Function (fetch-place-info) 
 * * ↓ 
 * * React
 * * ↓ 
 * * 식당 이름 / 주소 / 이미지 정보 반환
 * **************************************************************
 */

/// <reference path="../deno-global.d.ts" />
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

// --- CORS: 브라우저(React)에서 호출 허용 ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

// 일반 브라우저처럼 보이게 (봇 차단 완화)
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// 네이버 기본 지도 OG 이미지 — 식당 사진으로 쓰지 않음
const GENERIC_NAVER_IMAGES = [
  'og-map-400x200.png',
  'og-map',
  'favicon',
]

// --- HTML 파싱 헬퍼 ---

/** og:title, og:image 등 <meta property="..."> 값 추출 */
function pickMeta(html: string, prop: string): string {
  const escaped = prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(
    `<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']|` +
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["']`,
    'i',
  )
  const m = html.match(re)
  return decodeHtml((m?.[1] ?? m?.[2] ?? '').trim())
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

/** <title> 태그 (OG 없을 때 보조) */
function pickTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return decodeHtml((m?.[1] ?? '').trim())
}

/** "네이버 지도" 같은 의미 없는 제목 제외 */
function isGenericTitle(title: string): boolean {
  const t = title.trim()
  if (!t) return true
  return /네이버\s*(지도|플레이스|맵)?/i.test(t) || t === 'Naver Map'
}

function isGenericImage(url: string): boolean {
  if (!url) return true
  return GENERIC_NAVER_IMAGES.some((part) => url.includes(part))
}

/** URL에서 네이버 place ID(숫자) 추출 */
function extractPlaceId(url: string): string | null {
  const patterns = [
    /\/place\/(\d+)/,
    /\/entry\/place\/(\d+)/,
    /\/restaurant\/(\d+)/,
    /\/place\/(\d+)\//,
    /placeId=(\d+)/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m?.[1]) return m[1]
  }
  return null
}

/**
 * 네이버 플레이스 HTML 안 __APOLLO_STATE__ JSON 파싱
 * (페이지에 embedded된 GraphQL 상태 — 있을 때만 동작)
 */
function parseApolloState(html: string): { name: string; address: string; imageUrl: string } {
  const marker = '__APOLLO_STATE__'
  const idx = html.indexOf(marker)
  if (idx < 0) return { name: '', address: '', imageUrl: '' }

  const start = html.indexOf('{', idx)
  if (start < 0) return { name: '', address: '', imageUrl: '' }

  // 중괄호 depth로 JSON 끝 위치 찾기
  let depth = 0
  let end = -1
  for (let i = start; i < html.length; i++) {
    const ch = html[i]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) {
        end = i + 1
        break
      }
    }
  }
  if (end < 0) return { name: '', address: '', imageUrl: '' }

  try {
    const data = JSON.parse(html.slice(start, end))
    let name = ''
    let address = ''
    let imageUrl = ''

    // JSON 트리 전체를 돌며 name / address / imageUrl 찾기
    const walk = (node: unknown): void => {
      if (!node || typeof node !== 'object') return
      if (Array.isArray(node)) {
        for (const item of node) walk(item)
        return
      }
      const obj = node as Record<string, unknown>
      if (!name && typeof obj.name === 'string' && obj.name.trim() && !isGenericTitle(obj.name)) {
        name = obj.name.trim()
      }
      if (!address && typeof obj.roadAddress === 'string' && obj.roadAddress.trim()) {
        address = obj.roadAddress.trim()
      }
      if (!address && typeof obj.address === 'string' && obj.address.trim()) {
        address = obj.address.trim()
      }
      if (!imageUrl && typeof obj.imageUrl === 'string' && !isGenericImage(obj.imageUrl)) {
        imageUrl = obj.imageUrl.trim()
      }
      if (!imageUrl && Array.isArray(obj.images) && obj.images[0] && typeof obj.images[0] === 'object') {
        const img = obj.images[0] as Record<string, unknown>
        if (typeof img.url === 'string' && !isGenericImage(img.url)) {
          imageUrl = img.url.trim()
        }
      }
      for (const value of Object.values(obj)) walk(value)
    }

    walk(data)
    return { name, address, imageUrl }
  } catch {
    return { name: '', address: '', imageUrl: '' }
  }
}

// --- HTTP: HTML 받아오기 ---

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': BROWSER_UA,
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
    },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
  return await res.text()
}

/** naver.me 등 짧은 링크 → 최종 URL로 리다이렉트 따라가기 */
async function resolveUrl(url: string): Promise<string> {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'User-Agent': BROWSER_UA },
    redirect: 'follow',
  })
  return res.url || url
}

// --- 핵심: URL → { name, address, imageUrl } ---

async function fetchPlaceMeta(rawUrl: string): Promise<{
  name: string
  address: string
  imageUrl: string
}> {
  const resolved = await resolveUrl(rawUrl)
  const placeId = extractPlaceId(resolved)

  // #DEBUG LOG — 디버깅용, 원인 파악 후 삭제
  console.log('RAW_URL', rawUrl)
  console.log('RESOLVED_URL', resolved)
  console.log('PLACE_ID', placeId)

  // 여러 URL 시도: map.naver 실패 시 pcmap / m.place 에 OG가 있는 경우 많음
  const candidates: string[] = [
    resolved,
    ...(placeId
      ? [
          `https://pcmap.place.naver.com/restaurant/${placeId}/home`,
          `https://pcmap.place.naver.com/place/${placeId}/home`,
          `https://m.place.naver.com/restaurant/${placeId}/home`,
          `https://m.place.naver.com/place/${placeId}/home`,
        ]
      : []),
  ]

  let name = ''
  let address = ''
  let imageUrl = ''

  for (const candidate of candidates) {
    // #DEBUG LOG — 디버깅용, 원인 파악 후 삭제
    console.log('TRY_CANDIDATE', candidate)

    try {
      const html = await fetchHtml(candidate)

      // #DEBUG LOG — HTML이 SPA 껍데기인지 확인 (앞 500자)
      console.log('HTML_PREVIEW', html.slice(0, 500))

      const apollo = parseApolloState(html)

      // 비어 있을 때만 채움 (앞 후보에서 이미 찾은 값 유지)
      name ||= apollo.name
      address ||= apollo.address
      imageUrl ||= apollo.imageUrl

      // OG 메타 (카카오톡/네이버 미리보기와 같은 방식)
      name ||= pickMeta(html, 'og:title')
      address ||= pickMeta(html, 'og:description')

      const ogImage = pickMeta(html, 'og:image')
      if (!imageUrl && ogImage && !isGenericImage(ogImage)) {
        imageUrl = ogImage
      }

      const title = pickTitle(html)
      if (!name && title && !isGenericTitle(title)) name = title

      // #DEBUG LOG — 후보 URL 하나 처리 후 누적 결과
      console.log('RESULT', { name, address, imageUrl })

      // 이름 찾으면 더 시도하지 않음 (이미지는 이 시점까지 누적)
      if (name) break
    } catch (e) {
      // #DEBUG LOG — fetch/파싱 실패 시 (429 등) 다음 후보로
      console.log('CANDIDATE_FAILED', candidate, String(e))
    }
  }

  if (isGenericImage(imageUrl)) imageUrl = ''

  return { name, address, imageUrl }
}

// --- HTTP 진입점 ---

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'url required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await fetchPlaceMeta(url.trim())

    return new Response(JSON.stringify(body), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
