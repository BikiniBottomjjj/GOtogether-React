export async function copyLink(url: string) {
  await navigator.clipboard.writeText(url).catch(() => {})
}

export function shareKakao(url: string) {
  if (!window.Kakao?.isInitialized()) return

  window.Kakao.Share.sendDefault({
    objectType: 'feed', //피드 형식으로 사용자에게 미리보기 제공
    content: {
      title: '같이 장소 정해보자!',
      description: '뭐먹을까? 뭐할까?',
      imageUrl: 'https://gotogether-react.vercel.app/og-image.jpg',
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
  })
}
//사파리 링크 공유하기 API제공d
export async function shareNative(url: string): Promise<boolean> {
  if (!navigator.share) return false  // Web Share API 미지원 환경 (PC 등)
  await navigator.share({
    title: '같이 장소 정해보자!',
    text: '뭐먹을까? 뭐할까?',
    url,
  })
  return true
}