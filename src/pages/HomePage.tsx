/** 홈 — 방 이름 입력 후 생성·링크 복사 */
import { useState } from 'react'
import { createBoard } from '../api/boardApi'
import { useToast } from '../hooks/useToast'
import { shareKakao, copyLink } from '../lib/share'
import logoMain from '../assets/logo_main.png'
import iconKakao from '../assets/icon_Kakao.png'
import iconShare from '../assets/icon_share.png'

export function HomePage() {
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [nameError, setNameError] = useState(false)
  const { showToast } = useToast()

  const ensureLink = async (): Promise<string | null> => {
    if (link) return link

    const trimmed = name.trim()
    if (!trimmed) {
      setNameError(true)
      showToast('방 이름을 입력해주세요')
      return null
    }
    setNameError(false)

    const board = await createBoard(trimmed)
    if (!board) {
      showToast('오류가 났어요 😢')
      return null
    }

    const generatedLink = `${window.location.origin}/?room=${board.id}`
    setLink(generatedLink)
    return generatedLink
  }

  const handleKakaoShare = async () => {
    const url = await ensureLink()
    if (url) shareKakao(url)
  }

  const handleCopyLink = async () => {
    const url = await ensureLink()
    if (!url) return
    await copyLink(url)
    showToast('링크 복사 완료!')
  }

  return (
    <div className="home">
      <div className="home-inner">
        <img src={logoMain} alt="뭐하지? 뭐먹을까?" className="home-logo" />

        <p className="home-desc">
          방 만들고 링크 공유하면
          <br />
          친구들이 바로 참여할 수 있어요
        </p>

        <div className="field">
          <label htmlFor="roomName">방 이름</label>
          <input
            id="roomName"
            type="text"
            placeholder="예 : 이번 주 강남 맛집"
            maxLength={20}
            value={name}
            className={nameError ? 'input-error' : ''}
            onChange={(e) => {
              setName(e.target.value)
              if (e.target.value) setNameError(false)
            }}
            onKeyDown={(e) => e.key === 'Enter' && void handleCopyLink()}
          />
        </div>

        <div className="share-buttons">
          <button
            type="button"
            className="btn-icon btn-icon-kakao"
            onClick={() => void handleKakaoShare()}
            aria-label="카카오톡 공유"
          >
            <img src={iconKakao} alt="" />
          </button>
          <button
            type="button"
            className="btn-icon btn-icon-link"
            onClick={() => void handleCopyLink()}
            aria-label="링크 복사"
          >
            <img src={iconShare} alt="" />
          </button>
        </div>
      </div>
    </div>
  )
}
