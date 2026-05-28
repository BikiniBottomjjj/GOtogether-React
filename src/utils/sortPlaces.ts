/** 좋아요 수 내림차순 정렬 */
import type { Place } from '../types/place'

export function sortPlacesByLikes(places: Place[]): Place[] {
  return [...places].sort((a, b) => b.likes - a.likes)
}
