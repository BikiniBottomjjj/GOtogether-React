import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ToastProvider } from './hooks/useToast'
import './index.css'

const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY

function initKakao() {
  if (!kakaoKey) return
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(kakaoKey)
  }
}

if (window.Kakao) {
  initKakao()
} else {
  // load 이벤트가 이미 지나갔을 경우 대비해 interval로 재시도
  const interval = setInterval(() => {
    if (window.Kakao) {
      initKakao()
      clearInterval(interval)
    }
  }, 100)

  // 3초 후에도 안 되면 포기
  setTimeout(() => clearInterval(interval), 3000)
}
// if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
//   window.Kakao.init(kakaoKey)
// }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
