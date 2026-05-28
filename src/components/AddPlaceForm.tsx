/** 보드 — 사진(선택) + 네이버 링크 입력 + 추가 버튼 */
import { useRef, useState } from 'react'
import { getCharEmoji } from '../constants/characters'
import { getChar, getNickname } from '../lib/profile'

interface AddPlaceFormProps {
  adding: boolean
  onAdd: (url: string, file: File | null) => void
}

export function AddPlaceForm({ adding, onAdd }: AddPlaceFormProps) {
  const [url, setUrl] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    fileRef.current = file
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const submit = () => {
    onAdd(url.trim(), fileRef.current)
    setUrl('')
    setPreview(null)
    fileRef.current = null
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="add-section">
      <div className="my-info-row">
        <span style={{ fontSize: 20 }}>{getCharEmoji(getChar())}</span>
        <span>
          <strong>{getNickname()}</strong>으로 참여 중
        </span>
      </div>

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

      <div className="url-row">
        <input
          ref={inputRef}
          type="text"
          placeholder="네이버 지도 링크 붙여넣기"
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
    </div>
  )
}
