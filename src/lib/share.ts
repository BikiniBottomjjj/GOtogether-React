// 링크 공유 함수
export async function copyLink(url: string){
    await navigator.clipboard.writeText(url)
}

//카카오 공유
export async function shareKakao(url: string){
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