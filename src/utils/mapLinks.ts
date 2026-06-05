/** 네이버·카카오 지도 홈 — 식당 찾아 링크 복사용 */
export const NAVER_MAP_HOME = 'https://map.naver.com/v5/'
export const KAKAO_MAP_HOME = 'https://map.kakao.com/'

export function openMapHome(target: 'naver' | 'kakao'): void {
  const href = target === 'naver' ? NAVER_MAP_HOME : KAKAO_MAP_HOME
  window.open(href, '_blank', 'noopener,noreferrer')
}
