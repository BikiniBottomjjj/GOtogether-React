/**
 * 장소 추가 폼 컴포넌트
 * - 링크 입력
 * - 사진 업로드 (선택)
 * - 이름 입력 (선택)
 * 기능 담당
 * */
import { useRef, useState } from 'react'
import { getCharEmoji } from '../constants/characters'
import { getChar, getNickname } from '../lib/profile'
import { useToast } from '../hooks/useToast'

// 부모 컴포넌트(BoardPage)에서 전달받는 Props
interface AddPlaceFormProps {
  // 장소 추각 진행 중 여부
  adding: boolean
  // 장소 추가 실행 함수
  onAdd: (url: string, name: string, file: File | null) => void
}

export function AddPlaceForm({ adding, onAdd }: AddPlaceFormProps) {
  const { showToast } = useToast() // 토스트 알림 함수
  const [name, setName] = useState('') // 장소 이름 입력 상태
  const [url, setUrl] = useState('') // 링크 입력 상태
  const [preview, setPreview] = useState<string | null>(null) // 사진 미리보기
  const fileRef = useRef<File | null>(null) // 실제 업로드할 파일 저장
  const inputRef = useRef<HTMLInputElement>(null) // 링크 입력 참조

  // 사진 파일 처리 함수
  const handleFile = (file: File | undefined) => {
    if (!file) return
    fileRef.current = file // 업로드 파일 저장
    const reader = new FileReader() // 이미지 미리보기 생성
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // 장소 추가 버튼 클릭 시 실행 함수
  const submit = () => {
    // 링크와 사진 둘다 없으면 막기
    const trimmedUrl = url.trim()
    if (!trimmedUrl && !fileRef.current) {
      showToast('링크나 사진을 추가해주세요')
      return
    }
    // 부모 컴포넌트(BoardPage)에 전달
    onAdd(trimmedUrl, name.trim(), fileRef.current)
  }

  return (
    <div className="add-section">
      {/* 내 정보 표시 */}
      <div className="my-info-row">
        {/* 캐릭터 이모지 */}
        <span style={{ fontSize: 20 }}>{getCharEmoji(getChar())}</span>
        {/* 닉네임 */}
        <span>
          <strong>{getNickname()}</strong>으로 참여 중
        </span>
      </div>

      {/* 링크 입력 필드 */}
      <div className="url-row">
        <input
          ref={inputRef}
          type="text"
          placeholder="링크 붙여넣기 (네이버 지도, 블로그 등)"
          value={url}
          // 입력값 변경
          onChange={(e) => setUrl(e.target.value)}
          // Enter 입력 시 추가 실행
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        {/* 추가 버튼 */}
        <button
          type="button"
          className="btn-plus"
          disabled={adding}
          onClick={submit}
          aria-label="장소 추가"
        >
          {/* 추가 중이면 로딩 표시 */}
          {adding ? <span className="spin" /> : '+'}
        </button>
      </div>

      {/* 사진 업로드 필드 */}
      <label className="photo-upload">
        <input
          type="file"
          // 이미지 파일만 선택
          accept="image/*"
          // 사진 파일 처리 함수
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {/* 미리보기 이미지 */}
        {preview ? (
          <img className="photo-preview" src={preview} alt="" />
        ) : null}
        {/* 미리보지 이미지 없으면 라벨 표시 */}
        {!preview ? (
          <div className="photo-label">
            <span style={{ fontSize: 26 }}>📷</span>
            <span>사진 추가 (선택)</span>
            <span style={{ fontSize: 11, color: '#bbb' }}>탭해서 이미지 올리기</span>
          </div>
        ) : null}
      </label>

      {/* 장소 이름 입력 필드 */}
      <div className="field">
        <label htmlFor="placeName">식당 이름 (선택)</label>
        <input
          id="placeName"
          type="text"
          placeholder="입력하지 않으면 링크에서 자동 추출"
          maxLength={40}
          value={name}
          // 입력값 변경
          onChange={(e) => setName(e.target.value)}
          // Enter 입력 시 추가 실행
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
      </div>
    </div>
  )
}
