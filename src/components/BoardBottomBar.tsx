/** 보드 하단 고정: 링크 공유 · 새로고침 */
interface BoardBottomBarProps {
  onShare: () => void
  onRefresh: () => void
}

export function BoardBottomBar({ onShare, onRefresh }: BoardBottomBarProps) {
  return (
    <div className="bottom-bar">
      <button type="button" className="btn btn-outline" onClick={onShare}>
        🔗 링크 공유
      </button>
      <button type="button" className="btn btn-outline" onClick={onRefresh}>
        ↻ 새로고침
      </button>
    </div>
  )
}
