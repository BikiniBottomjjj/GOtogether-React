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
  //프로필 설정을 완료했는지 기억하는 스위치, 처음 false 완료 버튼 누르면 true
  const [profileDone, setProfileDone] = useState(false)  // ✅ 새로 추가

  useEffect(() => {
    if (!roomId) {
      setRoomName('')
      return
    }
    void getBoard(roomId).then((b) => setRoomName(b?.name ?? ''))
  }, [roomId])

  const screen = useMemo(() => {
    if (!roomId) return 'home' as const
    // 완료 버튼을 눌렀으면 무조건 공유방으로 이동, 안눌렀을 때만 나머지 조건 확인
    return 'board' as const
    if (!profileDone && (forceProfile || !isProfileComplete())) return 'profile' as const
  }, [roomId, forceProfile, profileDone])  // ✅ profileDone 추가

  return (
    <>
      <Header roomLabel={screen !== 'home' ? roomName : ''} />
      {screen === 'home' && <HomePage />}
      {screen === 'profile' && (
        <ProfilePage roomId={roomId} onDone={() => setProfileDone(true)} />  // ✅ onDone 추가
      )}
      {screen === 'board' && <BoardPage roomId={roomId} />}
    </>
  )
}