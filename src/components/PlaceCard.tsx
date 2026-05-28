/** 장소 카드: 이미지, 이름, 올린 사람, 좋아요, 삭제, 지도 링크 */
import { getCharEmoji } from '../constants/characters'
import type { Place } from '../types/place'

interface PlaceCardProps {
  place: Place
  liked: boolean
  onLike: () => void
  onDelete: () => void
}

export function PlaceCard({ place, liked, onLike, onDelete }: PlaceCardProps) {
  const name =
    place.name && place.name !== '네이버 지도 장소' ? place.name : ''
  const posterEmoji = place.poster_char
    ? getCharEmoji(place.poster_char)
    : '👤'

  return (
    <div className="place-card">
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
        <div className="place-no-img">🗺️</div>
      )}
      <div className="place-body">
        {name ? <div className="place-name">{name}</div> : null}
        {place.poster_name ? (
          <div className="place-poster">
            <span className="poster-emoji">{posterEmoji}</span>
            <span>{place.poster_name}</span>
          </div>
        ) : null}
        <div className="place-foot">
          <button
            type="button"
            className={`like-btn${liked ? ' on' : ''}`}
            onClick={onLike}
          >
            {liked ? '♥' : '♡'} {place.likes}
          </button>
          <button type="button" className="del-btn" onClick={onDelete}>
            ✕
          </button>
        </div>
        {place.url ? (
          <a
            className="place-link"
            href={place.url}
            target="_blank"
            rel="noreferrer"
          >
            ↗ 네이버 지도에서 보기
          </a>
        ) : null}
      </div>
    </div>
  )
}
