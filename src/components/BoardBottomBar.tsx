import { useState } from 'react'

/** 보드 하단 고정: url 추가 */
interface BoardBottomBarProps {
  onUrlAdd: (url: string) => void
}

export function BoardBottomBar({ onUrlAdd }: BoardBottomBarProps) {
  const [url, setUrl] = useState('')

  const handleAdd = () => {
    if (!url.trim()) return
    onUrlAdd(url.trim())
    setUrl('')
  }

  return (
    <div className="bottom-bar">
      <div className="bottom-url-row">
        <input
          className="bottom-url-input"
          type="url"
          placeholder="복사 링크 입력"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter && handleAdd()'}
        />
        <button type="button" className="bottom-url-btn" onClick={handleAdd}>
          +
        </button>
      </div>
    </div>
  )
  // return (
  // <div className="bottom-bar">
  //   <button type="button" className="btn btn-outline" onClick={onShare}>
  //     🔗 링크 공유
  //   </button>
  //   <button type="button" className="btn btn-outline" onClick={onRefresh}>
  //     ↻ 새로고침
  //   </button>
  // </div>
  // )
}
