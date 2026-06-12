import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ToastProvider } from './hooks/useToast'
import './index.css'
import './lib/share'

// 카카오 공유 라이브러리 초기화
(window as any).Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
