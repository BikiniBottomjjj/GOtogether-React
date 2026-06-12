/**
 * 보드 페이지 데이터: 방 정보, 장소 목록, 좋아요 Set, 새로고침
 */
import { useCallback, useEffect, useState } from 'react'
import { getBoard } from '../api/boardApi'
import { listPlaces } from '../api/placeApi'
import { getMyLikes } from '../lib/likes'
import type { Place } from '../types/place'

export function useBoard(roomId: string) {
  const [roomName, setRoomName] = useState('')
  const [places, setPlaces] = useState<Place[]>([])
  const [myLikes, setMyLikes] = useState<Set<number>>(() => getMyLikes(roomId))
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const board = await getBoard(roomId)
    if (board) setRoomName(board.name)
    const list = await listPlaces(roomId)
    setPlaces(list)
    setMyLikes(getMyLikes(roomId))
    setLoading(false)
  }, [roomId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    roomName,
    places,
    setPlaces,
    myLikes,
    setMyLikes,
    loading,
    refresh,
  }
}
