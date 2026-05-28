/** 보드 메인 — 장소 목록·추가·좋아요·삭제 */
import { useState } from 'react'
import { addPlace, deletePlace, updatePlaceLikes, uploadPlaceImage } from '../api/placeApi'
import { AddPlaceForm } from '../components/AddPlaceForm'
import { BoardBottomBar } from '../components/BoardBottomBar'
import { DeletePlaceModal } from '../components/DeletePlaceModal'
import { PlaceCard } from '../components/PlaceCard'
import { useBoard } from '../hooks/useBoard'
import { useToast } from '../hooks/useToast'
import { saveMyLikes } from '../lib/likes'
import { getChar, getNickname } from '../lib/profile'
import type { Place } from '../types/place'
import { sortPlacesByLikes } from '../utils/sortPlaces'

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
  const [formKey, setFormKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<Place | null>(null)

  const handleAdd = async (url: string, file: File | null) => {
    if (!file && !url) {
      showToast('사진이나 링크를 추가해주세요')
      return
    }
    if (adding) return

    setAdding(true)
    let imageUrl = ''

    if (file) {
      showToast('업로드 중...')
      const uploaded = await uploadPlaceImage(file)
      if (!uploaded) {
        showToast('사진 업로드 실패 😢')
        setAdding(false)
        return
      }
      imageUrl = uploaded
    }

    const ok = await addPlace({
      roomId,
      url,
      imageUrl,
      posterName: getNickname(),
      posterChar: getChar(),
    })

    setAdding(false)
    if (!ok) {
      showToast('추가 실패 😢')
      return
    }
    showToast('추가 완료!')
    setFormKey((k) => k + 1)
    await refresh()
  }

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

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    const target = deleteTarget
    setDeleteTarget(null)
    const ok = await deletePlace(target)
    if (!ok) {
      showToast('삭제 실패 😢')
      return
    }
    showToast('삭제됐어요')
    await refresh()
  }

  const handleShare = () => {
    void navigator.clipboard
      .writeText(window.location.href)
      .then(() => showToast('링크 복사! 카톡에 붙여넣으세요 🎉'))
  }

  const sorted = sortPlacesByLikes(places)

  return (
    <>
      <main>
        <AddPlaceForm key={formKey} adding={adding} onAdd={(u, f) => void handleAdd(u, f)} />

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
              링크를 붙여넣어보세요!
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

      <BoardBottomBar onShare={handleShare} onRefresh={() => void refresh()} />

      {deleteTarget ? (
        <DeletePlaceModal
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void handleDeleteConfirm()}
        />
      ) : null}
    </>
  )
}
