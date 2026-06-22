/**이미지 임포트 */
import deleteModalImg from '../assets/delete_modal.png'
import deleteBtn from '../assets/delte.png'
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
        <img src={deleteModalImg} alt="삭제할게? 복구불가" className="modal-title-img" />
        <div className="modal-btns">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            뒤로 가기
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            <img src={deleteBtn} alt="삭제" className="modal-delete-btn-img" />
          </button>
        </div>
      </div>
    </div>
  )
}
