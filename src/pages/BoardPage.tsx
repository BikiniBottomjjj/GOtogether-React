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
import { fetchPlaceInfo } from '../utils/fetchPlaceInfo'
import { sortPlacesByLikes } from '../utils/sortPlaces'


interface BoardPageProps {
  // 방 ID
  roomId: string
}
// 문자열이 URL 형식인지 검사
function looksLikeUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim())
}

////////// 보드 메인 페이지 ////////////
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
  // 장소 추가 진행 중 여부
  const [adding, setAdding] = useState(false)
  // AddPlaceForm 강제 초기화용 key
  const [formKey, setFormKey] = useState(0)
  // 삭제 대상 장소
  const [deleteTarget, setDeleteTarget] = useState<Place | null>(null)

  // 장소 추가 처리
  const handleAdd = async (url: string, nameOverride: string, file: File | null) => {
    if (adding) return

    const trimmedUrl = url.trim()
    // 링크와 사진 둘 다 없으면 종료
    if (!trimmedUrl && !file) return

    setAdding(true)

    // 사용자가 입력한 이름
    let name = nameOverride
    if (looksLikeUrl(name)) name = ''
    let address = ''
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
    // * 링크 메타 정보 자동 추출 * //
    if (trimmedUrl) {
      showToast('링크 분석 중...')
      const meta = await fetchPlaceInfo(trimmedUrl)
      if (meta) {
        // 이름 없으면 자동 입력
        if (!name) name = meta.name
        address = meta.address
        // 업로드 이미지 없으면 OG 이미지 사용
        if (!imageUrl && meta.imageUrl) imageUrl = meta.imageUrl
      } else if (!file) {
        // 자동 추출 실패
        showToast('자동 정보 없음 — 링크만 저장합니다')
      }
    }
    
    // 장소 추가 Supabase API 호출
    // DB에 저장
    const ok = await addPlace({
      roomId,
      url: trimmedUrl,
      name,
      address,
      imageUrl,
      posterName: getNickname(),
      posterChar: getChar(),
    })

    setAdding(false)
    // 저장 실패
    if (!ok) {
      showToast('추가 실패 😢')
      return
    }
    showToast('추가 완료!')
    setFormKey((k) => k + 1)
    await refresh()
  }
  // 좋아요 처리
  const handleLike = async (place: Place) => {
    // 좋아요 상태 확인
    const liked = myLikes.has(place.id)
    // 좋아요 수 업데이트
    const newLikes = liked ? place.likes - 1 : place.likes + 1
    // Set 복사
    const next = new Set(myLikes)
    if (liked) next.delete(place.id)
    else next.add(place.id)

    // 상태 저장
    setMyLikes(next)
    // localStorage 저장
    saveMyLikes(roomId, next)

    // * 화면 즉시 업데이트 *//
    setPlaces((prev) =>
      prev.map((p) => (p.id === place.id ? { ...p, likes: newLikes } : p)),
    )
    // DB 업데이트
    await updatePlaceLikes(place.id, newLikes)
  }
  //* 삭제 확인 처리 *//
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

  //* 현재 페이지 링크 복사 *///
  const handleShare = () => {
    void navigator.clipboard
      .writeText(window.location.href)
      .then(() => showToast('링크 복사! 카톡에 붙여넣으세요 🎉'))
  }
  // 좋아요 순 정렬
  const sorted = sortPlacesByLikes(places)

  return (
    <>
      <main>
        {/* 장소 추가 폼 */}
        <AddPlaceForm key={formKey} adding={adding} onAdd={(u, n, f) => void handleAdd(u, n, f)} />

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
            // 장소 카드 목록
            sorted.map((p) => (
              // 장소 카드 컴포넌트
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

      {/* 하단 바 */}
      <BoardBottomBar onShare={handleShare} onRefresh={() => void refresh()} />

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
