/** 프로필 설정 — 캐릭터·닉네임 (최초 1회) */
import { useState } from 'react'
import { CharPicker } from '../components/CharPicker'
import type { CharacterId } from '../constants/characters'
import { useToast } from '../hooks/useToast'
import { getChar, getNickname, saveProfile } from '../lib/profile'

interface ProfilePageProps {
  roomId: string
  onDone: () => void
}

export function ProfilePage({ onDone }: ProfilePageProps) {
  const [char, setChar] = useState<CharacterId | ''>(getChar() || '')
  const [nickname, setNickname] = useState(getNickname())
  const { showToast } = useToast()

  //완료 버튼 클릭 후 공유 방 이동//
  const handleDone = () => {
    if (!char) {
      showToast('캐릭터를 선택해주세요')
      return
    }
    const trimmed = nickname.trim()
    if (!trimmed) {
      showToast('닉네임을 입력해주세요')
      return
    }
    saveProfile(trimmed, char)
    onDone()//이동
  }

  return (
    <div className="profile-screen">
      <div className="profile-inner">
        <div>
          <h2>프로필 설정</h2>
          <p>보드에서 사용할 캐릭터와 닉네임을 정해줘요</p>
        </div>
        <CharPicker selected={char} onSelect={setChar} />
        <div className="field">
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            placeholder="이름이나 별명"
            maxLength={10}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-yellow" onClick={handleDone}>
          완료
        </button>
      </div>
    </div>
  )
}
