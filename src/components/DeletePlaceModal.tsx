/** 장소 삭제 확인 모달 */
interface DeletePlaceModalProps {
  onCancel: () => void
  onConfirm: () => void
}

export function DeletePlaceModal({ onCancel, onConfirm }: DeletePlaceModalProps) {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal">
        <div className="modal-title">장소 삭제</div>
        <div className="modal-desc">이 장소를 정말 삭제하시겠어요?</div>
        <div className="modal-btns">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            아니요
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}
