export async function copyLink(url: string) {
  await navigator.clipboard.writeText(url).catch(() => {})
}

export function shareKakao(url: string) {
  if (!window.Kakao?.isInitialized()) return

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
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
