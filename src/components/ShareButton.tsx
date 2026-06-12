/** 링크 공유 버튼 */
import { copyLink, shareKakao } from '../lib/share'
import { useToast } from '../hooks/useToast'
import icon_Kakao from '../assets/icon_kakao.png'
import icon_share from '../assets/icon_share.png'

interface ShareButtonProps {
    url: string
}

export function ShareButton({ url }: ShareButtonProps) {
    const { showToast } = useToast() // 토스트 메시지 표시 함수

    return (
        <div className='share-buttons"'>
            <button
                type="button"
                className="btn-icon"
                onClick={() => shareKakao(url)}
            >
                <img src={icon_Kakao} alt="카카오톡 공유" />
            </button>
            <button
                type="button"
                className="btn-icon"
                onClick={async () => {
                    await copyLink(url)
                    showToast('링크 복사 완료!')
                }}
            >
                <img src={icon_share} alt="링크 복사" />
            </button>
        </div>
    )
}