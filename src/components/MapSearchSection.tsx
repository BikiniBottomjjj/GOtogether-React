//검색창, 지도, 결과 목록을 하나의 컴포넌트로 분리

import { useEffect, useRef, useState } from "react";

interface SearchResult {
    id: string
    name: string
    address: string
    lat: number
    lng: number
    mapUrl: string
}

interface Props {
    onAdd: (place: SearchResult) => void
}

export default function MapSearchSection({ onAdd }: Props) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const markersRef = useRef<any[]>([])
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])

    // 네이버 지도 초기화
    useEffect(() => {
        const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID

        const init = () => {
            if (!mapRef.current || !window.naver) return
            mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, {
                center: new window.naver.maps.LatLng(37.5665, 126.9780),
                zoom: 14,
            })
        }

        // 이미 로드된 경우
        if (window.naver?.maps) {
            init()
            return
        }

        // 이미 script 태그가 붙어있으면 중복 추가 방지
        const existing = document.querySelector('script[src*="openapi.map.naver.com"]')
        if (existing) {
            existing.addEventListener('load', init)
            return
        }

        // 새로 script 추가
        const s = document.createElement('script')
        s.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
        s.onload = init
        s.onerror = () => console.error('네이버 지도 스크립트 로드 실패. Client ID 확인 필요:', clientId)
        document.head.appendChild(s)
    }, [])
    //     if (window.naver?.maps) { init() }
    //     else {
    //         const s = document.createElement('script')
    //         s.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`
    //         s.onload = init
    //         document.head.appendChild(s)
    //     }
    // }, [])

    const handleSearch = async () => {
        if (!query.trim()) return
        const res = await fetch(`/api/naver-search?query=${encodeURIComponent(query)}`)
        const data = await res.json()
        const items = data.items.map((item: any) => ({
            id: item.mapx + item.mapy,
            // name: item.title.replace(/<[^>]+>/g, ''),
            name: item.title.replace(/<[^>]+>/g, '').replace(/\\/g, '').trim(),
            address: item.address,
            lat: Number(item.mapy) / 1e7,
            lng: Number(item.mapx) / 1e7,
            mapUrl: `https://map.naver.com/v5/search/${encodeURIComponent(item.title.replace(/<[^>]+>/g, ''))}`,
        }))
        setResults(items)
        if (items[0] && mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(
                new window.naver.maps.LatLng(items[0].lat, items[0].lng)
            )

            // ← 추가: zoom 레벨 설정
            mapInstanceRef.current.setZoom(17)
        }
    }

    // handleSearch 끝난 바로 다음 줄에 추가
    const handleMarker = (place: SearchResult) => {
        if (!mapInstanceRef.current) return

        // 이전 마커 제거
        markersRef.current.forEach(m => m.setMap(null))
        markersRef.current = []

        // 새 마커 추가
        const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(place.lat, place.lng),
            map: mapInstanceRef.current,
            title: place.name,
        })
        markersRef.current.push(marker)

        // 지도 중심 이동
        mapInstanceRef.current.setCenter(
            new window.naver.maps.LatLng(place.lat, place.lng)
        )
    }

    return (
        <div style={{ padding: '10px 12px' }}>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 8 }}>장소 검색</div>

            {/* 검색창 */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="식당 이름 검색"
                    style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid #eee', background: '#f5f0eb', fontSize: 13 }}
                />
                <button
                    onClick={handleSearch}
                    style={{ padding: '7px 14px', background: 'black', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
                >
                    검색
                </button>
            </div>

            {/* 지도 */}
            <div ref={mapRef} style={{ height: 200, borderRadius: 8, marginBottom: 8, background: '#deecd8' }} />

            {/* 결과 목록 */}
            {results.map(place => (
                <div
                    key={place.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid #f0ebe5' }}
                >

                    <div
                        onClick={() => handleMarker(place)}
                        style={{ cursor: 'pointer', flex: 1 }}
                    >
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{place.name}</div>
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{place.address}</div>
                    </div>
                    <button
                        onClick={() => onAdd(place)}
                        style={{ background: '#ff3b5c', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}
                    >
                        추가
                    </button>
                </div>
            ))}
        </div>
    )

}

