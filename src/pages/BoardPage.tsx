/** 보드 메인 — 장소 목록·추가·좋아요·삭제 */
import { useState } from 'react'
import { addPlace, deletePlace, updatePlaceLikes } from '../api/placeApi'
import { BoardBottomBar } from '../components/BoardBottomBar'
import { DeletePlaceModal } from '../components/DeletePlaceModal'
import MapSearchSection from '../components/MapSearchSection'
import { PlaceCard } from '../components/PlaceCard'
import { useBoard } from '../hooks/useBoard'
import { useToast } from '../hooks/useToast'
import { saveMyLikes } from '../lib/likes'
import { getChar, getNickname } from '../lib/profile'
import type { Place } from '../types/place'
import { sortPlacesByLikes } from '../utils/sortPlaces'
import { fetchPlaceInfo } from '../utils/fetchPlaceInfo'

interface BoardPageProps {
  roomId: string
}

export function BoardPage({ roomId }: BoardPageProps) {
  const { showToast } = useToast()
  const {
    places,
    setPlaces,
    myLikes,
    setMyLikes,
    loading,
    refresh,
  } = useBoard(roomId)

  const [adding, setAdding] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Place | null>(null)

  // 네이버 지도 검색 결과로 장소 추가
  const handleMapPlaceAdd = async (place: { name: string; address: string; mapUrl: string }) => {
    if (adding) return
    setAdding(true)

    let name = place.name
    let address = place.address
    let imageUrl = ''

    //url만 있고 이름 주소가 없으면 og 메타 자동 추출
    if (place.mapUrl && !name) {
      showToast('링크 분석 중...')
      const meta = await fetchPlaceInfo(place.mapUrl)
      if (meta) {
        name = meta.name
        address = meta.address
        imageUrl = meta.imageUrl
      }
    }

    const ok = await addPlace({
      roomId,
      url: place.mapUrl,
      name: place.name,
      address: place.address,
      imageUrl: '',
      posterName: getNickname(),
      posterChar: getChar(),
    })
    setAdding(false)
    if (!ok) { showToast('추가 실패 😢'); return }
    showToast('추가 완료!')
    await refresh()
  }

  // 좋아요 처리
  const handleLike = async (place: Place) => {
    const liked = myLikes.has(place.id)
    const newLikes = liked ? place.likes - 1 : place.likes + 1
    const next = new Set(myLikes)
    if (liked) next.delete(place.id)
    else next.add(place.id)

    setMyLikes(next)
    saveMyLikes(roomId, next)
    setPlaces((prev) =>
      prev.map((p) => (p.id === place.id ? { ...p, likes: newLikes } : p)),
    )
    await updatePlaceLikes(place.id, newLikes)
  }

  // 삭제 확인 처리
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    const target = deleteTarget
    setDeleteTarget(null)
    const ok = await deletePlace(target)
    if (!ok) { showToast('삭제 실패 😢'); return }
    showToast('삭제됐어요')
    await refresh()
  }

  // // 링크 복사
  // const handleShare = () => {
  //   void navigator.clipboard
  //     .writeText(window.location.href)
  //     .then(() => showToast('링크 복사! 카톡에 붙여넣으세요 🎉'))
  // }

  const sorted = sortPlacesByLikes(places)

  return (
    <>
      <div>
        {/* ① 네이버 지도 검색 */}
        <div>
          <MapSearchSection onAdd={handleMapPlaceAdd} />
        </div>

        {/* ② 장소 카드 목록 */}
        <main>
          <div className="place-list">
            {loading ? (
              <div className="spinner-wrap">
                <div className="spinner" />
                불러오는 중...
              </div>
            ) : sorted.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📍</div>
                아직 장소가 없어요
                <br />
                지도에서 검색해보세요!
              </div>
            ) : (
              sorted.map((p) => (
                <PlaceCard
                  key={p.id}
                  place={p}
                  liked={myLikes.has(p.id)}
                  onLike={() => void handleLike(p)}
                  onDelete={() => setDeleteTarget(p)}
                />
              ))
            )}
          </div>
        </main>

        {/* ③ 하단 고정 */}
        <BoardBottomBar
          // onShare={handleShare}
          // onRefresh={() => void refresh()}
          onUrlAdd={(url) => void handleMapPlaceAdd({ name: '', address: '', mapUrl: url })}
        />


      </div>

      {/* 삭제 확인 모달 */}
      {deleteTarget ? (
        <DeletePlaceModal
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void handleDeleteConfirm()}
        />
      ) : null}
    </>
  )
}
