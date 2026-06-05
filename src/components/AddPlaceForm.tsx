/**
 * 장소 추가 폼 컴포넌트
 * - 링크 입력
 * - 사진 업로드 (선택)
 * - 네이버/카카오 지도 바로가기
 */
import { useRef, useState } from 'react'
import { getCharImage } from '../constants/characters'
import { getChar, getNickname } from '../lib/profile'
import { useToast } from '../hooks/useToast'
import { openMapHome } from '../utils/mapLinks'

// 부모 컴포넌트(BoardPage)에서 전달받는 Props
interface AddPlaceFormProps {
  // 장소 추가 진행 중 여부
  adding: boolean
  // 장소 추가 실행 함수
  onAdd: (url: string, name: string, file: File | null) => void
}

export function AddPlaceForm({ adding, onAdd }: AddPlaceFormProps) {
  const { showToast } = useToast()
  const [url, setUrl] = useState('') // 링크 입력
  const [preview, setPreview] = useState<string | null>(null) // 사진 미리보기
  const fileRef = useRef<File | null>(null) // 업로드할 파일
  const inputRef = useRef<HTMLInputElement>(null)
  const char = getChar()
  const avatarSrc = char ? getCharImage(char) : undefined

  // 사진 선택 시 미리보기
  const handleFile = (file: File | undefined) => {
    if (!file) return
    fileRef.current = file
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // + 버튼 / Enter — BoardPage에 장소 추가 요청
  const submit = () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl && !fileRef.current) {
      showToast('링크나 사진을 추가해주세요')
      return
    }
    onAdd(trimmedUrl, '', fileRef.current)
  }

  return (
    <div className="add-section">
      {/* 참여 중 프로필 */}
      <div className="my-info-row">
        {avatarSrc ? (
          <img className="my-info-avatar" src={avatarSrc} alt="" />
        ) : null}
        <span>
          <strong>{getNickname()}</strong>으로 참여 중
        </span>
      </div>

      {/* 사진 업로드 (선택) */}
      <label className="photo-upload">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {preview ? (
          <img className="photo-preview" src={preview} alt="" />
        ) : null}
        {!preview ? (
          <div className="photo-label">
            <span style={{ fontSize: 26 }}>📷</span>
            <span>사진 추가 (선택)</span>
            <span style={{ fontSize: 11, color: '#bbb' }}>탭해서 이미지 올리기</span>
          </div>
        ) : null}
      </label>

      {/* 링크 입력 + 추가 */}
      <div className="url-row">
        <input
          ref={inputRef}
          type="text"
          placeholder="링크 붙여넣기 (네이버 지도, 카카오 지도 등)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button
          type="button"
          className="btn-plus"
          disabled={adding}
          onClick={submit}
          aria-label="장소 추가"
        >
          {adding ? <span className="spin" /> : '+'}
        </button>
      </div>

      {/* 지도 열기 → 링크 복사 후 위 입력칸에 붙여넣기 */}
      <div className="map-shortcuts">
        <button
          type="button"
          className="map-shortcut-btn"
          onClick={() => openMapHome('naver')}
        >
          🗺️ 네이버 지도 바로가기
        </button>
        <button
          type="button"
          className="map-shortcut-btn"
          onClick={() => openMapHome('kakao')}
        >
          🗺️ 카카오 지도 바로가기
        </button>
      </div>
    </div>
  )
}
