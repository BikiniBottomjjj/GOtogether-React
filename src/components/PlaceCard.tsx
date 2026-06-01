/** 장소 카드: 이미지, 이름, 올린 사람, 좋아요, 삭제, 지도 링크 */
import { getCharEmoji } from '../constants/characters'
import type { Place } from '../types/place'

// 부모 컴포넌트(BoardPage 등)에서 전달 받은 장소 정보
interface PlaceCardProps {
  place: Place
  liked: boolean
  onLike: () => void
  onDelete: () => void
}

// 장소 카드 컴포넌트
export function PlaceCard({ place, liked, onLike, onDelete }: PlaceCardProps) {
  // 장소 이름
  const name =
    place.name && place.name !== '네이버 지도 장소' ? place.name : ''
  // 캐릭터 이모지(올린 사람)
  const posterEmoji = place.poster_char
    ? getCharEmoji(place.poster_char)
    : '👤'

  return (
    <div className="place-card">
      {/* 장소 이미지 */}
      {place.image_url ? (
        <img
          className="place-img"
          src={place.image_url}
          alt=""
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : (
        // 이미지 없을 때 기본 아이콘 표시
        <div className="place-no-img">🗺️</div>
      )}
      {/* 장소 본문 */}
      <div className="place-body">
        {/* 장소 이름 */}
        {name ? <div className="place-name">{name}</div> : null}
        {/* 올린 사람 정보 */}
        {place.poster_name ? (
          <div className="place-poster">
            <span className="poster-emoji">{posterEmoji}</span>
            <span>{place.poster_name}</span>
          </div>
        ) : null}
        <div className="place-foot">  
          {/* 좋아요 버튼 */}
          <button
            type="button"
            className={`like-btn${liked ? ' on' : ''}`}
            onClick={onLike}
          >
            {liked ? '♥' : '♡'} {place.likes}
          </button>
          {/* 삭제 버튼 */}
          <button type="button" className="del-btn" onClick={onDelete}>
            ✕
          </button>
        </div>
        {/* 링크 열기 버튼 */}
        {place.url ? (
          <a
            className="place-link"
            href={place.url}
            target="_blank"
            rel="noreferrer"
          >
            ↗ 링크 열기
          </a>
        ) : null}
      </div>
    </div>
  )
}
