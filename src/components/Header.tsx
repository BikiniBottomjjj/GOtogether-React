/** 상단 고정 헤더: 로고, 방 이름, 내 프로필 뱃지 */
import { APP_NAME_HTML } from '../constants/branding'
import { getCharEmoji } from '../constants/characters'
import { getChar, getNickname, isProfileComplete } from '../lib/profile'

interface HeaderProps {
  roomLabel?: string
}

export function Header({ roomLabel = '' }: HeaderProps) {
  const showProfile = isProfileComplete()
  const nickname = getNickname()
  const char = getChar()

  return (
    <header>
      <div className="logo-wrap">
        <div className="logo">
          {APP_NAME_HTML.before}
          <em>{APP_NAME_HTML.accent}</em>
        </div>
        {roomLabel ? <div className="room-label">{roomLabel}</div> : null}
      </div>
      {showProfile ? (
        <div className="my-profile">
          <span className="my-avatar">{getCharEmoji(char)}</span>
          <span>{nickname}</span>
        </div>
      ) : null}
    </header>
  )
}
