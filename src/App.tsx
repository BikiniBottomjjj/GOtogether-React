/**
 * 앱 루트 — URL ?room= 쿼리로 화면 분기
 * 없음: 홈 | room + 프로필 없음: 프로필 | room + 프로필 있음: 보드
 */
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBoard } from './api/boardApi'
import { Header } from './components/Header'
import { isProfileComplete } from './lib/profile'
import { BoardPage } from './pages/BoardPage'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'

export default function App() {
  const [params] = useSearchParams()
  const roomId = params.get('room') ?? ''
  const forceProfile = params.get('setup') === 'profile'
  const [roomName, setRoomName] = useState('')

  useEffect(() => {
    if (!roomId) {
      setRoomName('')
      return
    }
    void getBoard(roomId).then((b) => setRoomName(b?.name ?? ''))
  }, [roomId])

  const screen = useMemo(() => {
    if (!roomId) return 'home' as const
    if (forceProfile || !isProfileComplete()) return 'profile' as const
    return 'board' as const
  }, [roomId, forceProfile])

  return (
    <>
      <Header roomLabel={screen !== 'home' ? roomName : ''} />
      {screen === 'home' && <HomePage />}
      {screen === 'profile' && <ProfilePage roomId={roomId} />}
      {screen === 'board' && <BoardPage roomId={roomId} />}
    </>
  )
}
