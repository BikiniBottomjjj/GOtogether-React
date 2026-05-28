/**
 * 방(room)별 "내가 좋아요 누른 장소 ID" — localStorage
 * DB의 places.likes 숫자와 함께 UI 상태 동기화
 */
export function getMyLikes(roomId: string): Set<number> {
  try {
    const raw = localStorage.getItem(`likes_${roomId}`)
    return new Set(raw ? (JSON.parse(raw) as number[]) : [])
  } catch {
    return new Set()
  }
}

export function saveMyLikes(roomId: string, likes: Set<number>): void {
  localStorage.setItem(`likes_${roomId}`, JSON.stringify([...likes]))
}
