/**
 * 장소(places) CRUD·좋아요·이미지 업로드 API
 * Supabase `places` 테이블 + Storage `image` 버킷
 */
import { supabase } from '../lib/supabase'
import type { AddPlaceInput, Place } from '../types/place'

export async function listPlaces(roomId: string): Promise<Place[]> {
  const { data, error } = await supabase
    .from('places')
    .select()
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('listPlaces', error)
    return []
  }
  return (data ?? []) as Place[]
}

export async function addPlace(input: AddPlaceInput): Promise<boolean> {
  const { error } = await supabase.from('places').insert({
    room_id: input.roomId,
    url: input.url,
    name: '',
    address: '',
    image_url: input.imageUrl,
    likes: 0,
    poster_name: input.posterName,
    poster_char: input.posterChar,
  })

  if (error) {
    console.error('addPlace', error)
    return false
  }
  return true
}

export async function updatePlaceLikes(
  placeId: number,
  likes: number,
): Promise<boolean> {
  const { error } = await supabase
    .from('places')
    .update({ likes })
    .eq('id', placeId)

  if (error) {
    console.error('updatePlaceLikes', error)
    return false
  }
  return true
}

export async function deletePlace(place: Place): Promise<boolean> {
  if (place.image_url) {
    try {
      const fileName = place.image_url.split('/').pop()
      if (fileName) {
        await supabase.storage.from('image').remove([fileName])
      }
    } catch (e) {
      console.warn('storage remove', e)
    }
  }

  const { error } = await supabase.from('places').delete().eq('id', place.id)
  if (error) {
    console.error('deletePlace', error)
    return false
  }
  return true
}

/** 선택 사진 → Storage 업로드 후 public URL 반환 */
export async function uploadPlaceImage(file: File): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg'
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('image')
    .upload(fileName, file, { contentType: file.type })

  if (error) {
    console.error('uploadPlaceImage', error)
    return null
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('image').getPublicUrl(fileName)
  return publicUrl
}
