/** 링크 공유 버튼 */
import { copyLink, shareKakao } from '../lib/share'
import { useToast } from '../hooks/useToast'
import iconKakao from '../assets/icon_Kakao.png'
import iconShare from '../assets/icon_share.png'

interface ShareButtonProps {
  url: string
}

export function ShareButton({ url }: ShareButtonProps) {
  const { showToast } = useToast()

  return (
    <div className="share-buttons">
      <button
        type="button"
        className="btn-icon btn-icon-kakao"
        onClick={() => shareKakao(url)}
        aria-label="카카오톡 공유"
      >
        <img src={iconKakao} alt="" />
      </button>
      <button
        type="button"
        className="btn-icon btn-icon-link"
        onClick={async () => {
          await copyLink(url)
          showToast('링크 복사 완료!')
        }}
        aria-label="링크 복사"
      >
        <img src={iconShare} alt="" />
      </button>
    </div>
  )
}
