/** 홈 — 방 이름 입력 후 생성·링크 공유 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBoard } from '../api/boardApi'
import { isProfileComplete } from '../lib/profile'
import { useToast } from '../hooks/useToast'
import { shareKakao, copyLink, shareNative } from '../lib/share'
// 이미지 파일 import
import logoMain from '../assets/logo_main.png'
import iconKakao from '../assets/icon_Kakao.png'
import iconShare from '../assets/icon_share.png'

export function HomePage() {
  const [name, setName] = useState('')// 방 이름 입력값 상태
  const [link, setLink] = useState('')// 생성된 링크 상태 (한 번 만들면 재사용)
  const [nameError, setNameError] = useState(false)// 방 이름 미입력 시 에러 표시 상태

  // useNavigate: 페이지 이동 함수를 반환하는 훅
  const navigate = useNavigate()
  const { showToast } = useToast()

  // 방 입장 경로로 이동하는 함수
  const navigateToRoom = (roomId: string) => {
    window.setTimeout(() => {
      const path = isProfileComplete()
        ? `/?room=${roomId}` // 프로필 있으면 바로 방으로
        : `/?room=${roomId}&setup=profile`// 없으면 프로필 설정 먼저
      navigate(path)
    }, 1000)
  }

  // 링크를 보장하는 함수, 이미 링크가 있으면 그대로 반환, 없으면 방 생성 후 링크 생성
  const ensureLink = async (): Promise<string | null> => {
    if (link) return link //링크 있으면 재사용

    const trimmed = name.trim()
    //방 이름 없으면 에러 발생
    if (!trimmed) {
      setNameError(true)
      showToast('방 이름을 입력해주세요')
      return null
    }
    setNameError(false)

    //Supabase에 방 생성 API 호출
    const board = await createBoard(trimmed)
    if (!board) {
      showToast('다시 시도 해주세요 😢')
      return null
    }

    // 현재 도메인 + 방 ID로 링크 생성
    const generatedLink = `${window.location.origin}${window.location.pathname}?room=${board.id}`
    setLink(generatedLink)
    return generatedLink
  }

  // 카카오톡 공유 버튼 핸들러
  // ensureLink로 링크 확보 후 카카오 SDK로 공유
  const handleKakaoShare = async () => {
    const url = await ensureLink() //링크를 받아올 때 까지 기다림
    if (!url) return

    const roomId = new URL(url).searchParams.get('room')
    if (!roomId) return

    shareKakao(url, () => {
      // 카카오 공유 팝업이 닫힌 후 호출되는 콜백
      const path = isProfileComplete()
        ? `/?room=${roomId}`
        : `/?room=${roomId}&setup=profile`
      navigate(path)
    })

    // 300ms 후 리스너 등록 — 공유창이 열리기 전 탭 숨김 이벤트를 무시하기 위함
    window.setTimeout(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          //리스너를 제거하여 페이지 이동이 한번만 실행되도록 하기 위함
          document.removeEventListener('visibilitychange', handleVisibilityChange)
          const path = isProfileComplete()
            ? `/?room=${roomId}` //프로필 있을 때 바로 공유방으로 이동
            : `/?room=${roomId}&setup=profile` //프로필이 없으면 프로필 설정 페이지 먼저
          navigate(path)
        }
      }
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }, 300)

  }

  // 링크 복사 버튼 핸들러 (Web Share API 미지원 시 대체)
  // 링크 복사 후 토스트 메시지 표시, 방으로 이동
  const handleCopyLink = async () => {
    const url = await ensureLink()
    if (!url) return
    await copyLink(url)
    showToast('링크 복사 완료! 카톡에 붙여넣으세요 🎉')

    // URL에서 room 파라미터 추출 후 방으로 이동  
    const roomId = new URL(url).searchParams.get('room')
    if (roomId) navigateToRoom(roomId)
  }

  // iOS Share Sheet 공유 버튼 핸들러
  // Web Share API 지원 시 iOS 공유 모달, 미지원 시 링크 복사로 대체
  const handleNativeShare = async () => {
    const url = await ensureLink()
    if (!url) return
    const shared = await shareNative(url)
    if (!shared) {
      // Web Share API 미지원 시 링크 복사로 대체
      await copyLink(url)
      showToast('링크 복사 완료! 카톡에 붙여넣으세요 🎉')
    }
  }


  return (
    <div className="home">
      <div className="home-inner">
        {/* 로고 이미지 */}
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
            placeholder="예: 이번 주 강남 맛집"
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
            onClick={() => void handleNativeShare()}
            // onClick={() => void handleCopyLink()} web share api 미지원시 사용 */
            aria-label="공유하기"
          >
            <img src={iconShare} alt="" />
          </button>
        </div>
      </div>
    </div>
  )
}
