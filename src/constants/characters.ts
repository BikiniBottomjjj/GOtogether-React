/** 보드에서 선택 가능한 캐릭터 목록 (프로필·장소 카드 표시용) */
import sponge from '../assets/sponge.png'
import patrick from '../assets/patrick.png'
import plankton from '../assets/plankton.png'

export type CharacterId = 'sponge' | 'patrick' | 'plankton'

export interface Character {
  id: CharacterId
  emoji: string
  name: string
  image: string
}

export const CHARACTERS: Character[] = [
  { id: 'sponge', emoji: '🧽', name: '스폰지밥', image: sponge },
  { id: 'patrick', emoji: '⭐', name: '뚱이', image: patrick },
  { id: 'plankton', emoji: '🦑', name: '플랑크톤', image: plankton },
]

export function getCharEmoji(charId: string): string {
  return CHARACTERS.find((c) => c.id === charId)?.emoji ?? '👤'
}

export function getCharImage(charId: string): string | undefined {
  return CHARACTERS.find((c) => c.id === charId)?.image
}
