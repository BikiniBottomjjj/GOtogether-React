/** 보드에서 선택 가능한 캐릭터 목록 (프로필·장소 카드 표시용) */
export type CharacterId = 'sponge' | 'patrick' | 'squid'

export interface Character {
  id: CharacterId
  emoji: string
  name: string
}

export const CHARACTERS: Character[] = [
  { id: 'sponge', emoji: '🧽', name: '스폰지밥' },
  { id: 'patrick', emoji: '⭐', name: '뚱이' },
  { id: 'squid', emoji: '🦑', name: '징징이' },
]

export function getCharEmoji(charId: string): string {
  return CHARACTERS.find((c) => c.id === charId)?.emoji ?? '👤'
}
