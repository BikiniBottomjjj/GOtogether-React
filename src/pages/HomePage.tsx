/** 홈 — 방 이름 입력 후 생성·링크 복사 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBoard } from '../api/boardApi'
import { isProfileComplete } from '../lib/profile'
import { useToast } from '../hooks/useToast'

export function HomePage() {
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleCreate = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      showToast('방 이름을 입력해주세요')
      return
    }

    const board = await createBoard(trimmed)
    if (!board) {
      showToast('오류가 났어요 😢')
      return
    }

    const link = `${window.location.origin}${window.location.pathname}?room=${board.id}`
    await navigator.clipboard.writeText(link).catch(() => {})
    showToast('링크 복사 완료! 카톡에 붙여넣으세요 🎉')

    window.setTimeout(() => {
      const path = isProfileComplete()
        ? `/?room=${board.id}`
        : `/?room=${board.id}&setup=profile`
      navigate(path)
    }, 1000)
  }

  return (
    <div className="home">
      <div className="home-inner">
        <div>
          <h1>
            같이 고르자
            <br />
            <em>장소 투표판</em>
          </h1>
          <p style={{ marginTop: '0.5rem' }}>
            방 만들고 링크 공유하면
            <br />
            친구들이 바로 참여할 수 있어요
          </p>
        </div>
        <div className="field">
          <label htmlFor="roomName">방 이름</label>
          <input
            id="roomName"
            type="text"
            placeholder="예: 이번 주 강남 맛집"
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void handleCreate()}
          />
        </div>
        <button type="button" className="btn btn-black" onClick={() => void handleCreate()}>
          방 만들고 링크 복사
        </button>
      </div>
    </div>
  )
}
