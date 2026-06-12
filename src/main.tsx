import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ToastProvider } from './hooks/useToast'
import './index.css'

const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY
if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
  window.Kakao.init(kakaoKey)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
