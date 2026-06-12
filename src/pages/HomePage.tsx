/** 홈 — 방 이름 입력 후 생성·링크 복사 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBoard } from '../api/boardApi'
import { isProfileComplete } from '../lib/profile'
import { useToast } from '../hooks/useToast'
import { shareKakao, copyLink } from '../lib/share'
import icon_Kakao from '../assets/icon_kakao.png'
import icon_share from '../assets/icon_share.png'

export function HomePage() {
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [nameError, setNameError] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleCreate = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setNameError(true)
      showToast('방 이름을 입력해주세요')
      return
    }
    setNameError(false)

    const board = await createBoard(trimmed)
    if (!board) {
      showToast('오류가 났어요 😢')
      return
    }

    const generatedLink = `${window.location.origin}/?room=${board.id}`
    setLink(generatedLink)
  }

  const handleEnter = () => {
    const roomId = link.split('room=')[1]
    const path = isProfileComplete()
      ? `/?room=${roomId}`
      : `/?room=${roomId}&setup=profile`
    navigate(path)
  }

  return (
    <div className="home">
      <div className="home-inner">
        <div>
          <h1>
            어디 갈지
            <br />
            <em>정해보자</em>
          </h1>
          <p style={{ marginTop: '0.5rem' }}>
            방 만들고 링크 공유하면
            <br />
            친구들이 바로 참여할 수 있어요
          </p>
        </div>

        {/* 링크 생성 전 — 방 이름 입력 */}
        {!link && (
          <>
            <div className="field">
              <label htmlFor="roomName">방 이름</label>
              <input
                id="roomName"
                type="text"
                placeholder="예: 이번 주 강남 맛집"
                maxLength={20}
                value={name}
                className={nameError ? 'input-error' : ''}
                onChange={(e) => {
                  setName(e.target.value)
                  if (e.target.value) setNameError(false)
                }}
                onKeyDown={(e) => e.key === 'Enter' && void handleCreate()}
              />
            </div>
            <button
              type="button"
              className="btn btn-black"
              onClick={() => void handleCreate()}
            >
              방 만들기
            </button>
          </>
        )}

        {/* 링크 생성 후 — 공유 버튼 */}
        {link && (
          <div className="share-section">
            <p className="share-desc">친구들에게 공유해보세요!</p>
            <div className="share-buttons">
              <button
                type="button"
                className="btn-icon"
                onClick={() => shareKakao(link)}
                aria-label="카카오톡 공유"
              >
                <img src={icon_Kakao} alt="카카오톡 공유" />
              </button>
              <button
                type="button"
                className="btn-icon"
                onClick={async () => {
                  await copyLink(link)
                  showToast('링크 복사 완료!')
                }}
                aria-label="링크 복사"
              >
                <img src={icon_share} alt="링크 복사" />
              </button>
            </div>
            <button
              type="button"
              className="btn btn-black"
              onClick={handleEnter}
            >
              보드 입장하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}