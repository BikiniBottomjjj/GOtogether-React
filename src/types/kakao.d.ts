/** 카카오 공유 라이브러리 타입 */
/** 카카오 SDK 타입 정의*/
interface Window {
    Kakao: {
        init: (key: string) => void
        isInitialized: () =>boolean
        Share:{
            sendDefault: (options: object) => void 
        }
    }
}