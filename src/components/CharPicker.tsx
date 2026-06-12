/** 프로필 설정 — 캐릭터 3종 선택 그리드 */
import { CHARACTERS, type CharacterId } from '../constants/characters'

interface CharPickerProps {
  selected: CharacterId | ''
  onSelect: (id: CharacterId) => void
}

export function CharPicker({ selected, onSelect }: CharPickerProps) {
  return (
    <div className="char-grid">
      {CHARACTERS.map((c) => (
        <button
          key={c.id}
          type="button"
          className={`char-btn${selected === c.id ? ' selected' : ''}`}
          onClick={() => onSelect(c.id)}
        >
          <img
            src={c.image}
            alt={c.name}
            className="char-img"
          />
          <span className="char-name">{c.name}</span>
        </button>
      ))}
    </div>
  )
}
