import { useState } from 'react'

/** 보드 하단 고정: url 추가 */
interface BoardBottomBarProps {
  onUrlAdd: (url: string) => void
  clipboardUrl: string
  onClipboardUrlAdd: () => void
}

export function BoardBottomBar({ onUrlAdd, clipboardUrl, onClipboardUrlAdd }: BoardBottomBarProps) {
  const [url, setUrl] = useState('')

  const handleAdd = () => {
    if (!url.trim()) return
    onUrlAdd(url.trim())
    setUrl('')
  }

  const handleClipboardApply = () => {
    if (clipboardUrl) {          // ! 제거: URL 있을 때 실행
      setUrl(clipboardUrl)
      onClipboardUrlAdd()        // 이름 통일
    }
  }

  const handleClipboardDismiss = () => {
    onClipboardUrlAdd()          // 이름 통일
  }

  return (
    <div className="bottom-bar">
      {clipboardUrl && (
        <div className="clipboard-banner">
          <span className="clipboard-banner-text">복사하신 링크를 붙여넣으시겠습니까?</span>
          <div className="clipboard-banner-actions">
            <button type="button" className="clipboard-banner-btn apply" onClick={handleClipboardApply}>
              붙여넣기
            </button>
            <button type="button" className="clipboard-banner-btn dismiss" onClick={handleClipboardDismiss}>
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="bottom-url-row">   {/* input 중복 제거, div 하나로 정리 */}
        <input
          className="bottom-url-input"
          type="url"
          placeholder="복사 링크 입력"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button type="button" className="bottom-url-btn" onClick={handleAdd}>
          +
        </button>
      </div>
    </div>
  )
}