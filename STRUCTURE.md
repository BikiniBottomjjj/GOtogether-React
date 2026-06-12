# GOTogether 폴더 구조

팀원 프로토타입(`reference/index.html`)을 React로 분리한 구조입니다.  
각 `src/` 파일 상단 주석과 함께 참고하세요.

---

## 트리 (파일별 주석)

```
GOTogether/
├── reference/
│   ├── index.html                  # 단일 HTML 프로토타입 (마이그레이션 이전 UI)
│   └── README.md
│
├── src/
│   ├── main.tsx                    # createRoot · BrowserRouter · ToastProvider
│   ├── App.tsx                     # roomId / setup 쿼리 → home | profile | board
│   ├── index.css
│   ├── vite-env.d.ts
│   │
│   ├── pages/
│   │   ├── HomePage.tsx            # createBoard → ?room= 이동 · 링크 복사
│   │   ├── ProfilePage.tsx         # CharPicker + 닉네임 → saveProfile
│   │   └── BoardPage.tsx           # useBoard · AddPlaceForm · PlaceCard 목록
│   │
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── CharPicker.tsx
│   │   ├── AddPlaceForm.tsx
│   │   ├── PlaceCard.tsx
│   │   ├── DeletePlaceModal.tsx
│   │   ├── BoardBottomBar.tsx
│   │   └── Toast.tsx
│   │
│   ├── hooks/
│   │   ├── useToast.tsx
│   │   └── useBoard.ts
│   │
│   ├── api/
│   │   ├── boardApi.ts             # createBoard, getBoard  → rooms
│   │   └── placeApi.ts             # list, add, like, delete, uploadImage → places + Storage
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── profile.ts
│   │   └── likes.ts
│   │
│   ├── types/
│   │   ├── board.ts
│   │   └── place.ts
│   │
│   ├── constants/
│   │   ├── branding.ts
│   │   └── characters.ts
│   │
│   └── utils/
│       ├── sortPlaces.ts
│       └── fetchPlaceInfo.ts       # 2차 — 현재 null 반환
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
├── .env.example
├── README.md
└── STRUCTURE.md
```

---

## 레이어별 역할

| 레이어 | 폴더 | 역할 |
|--------|------|------|
| 화면 | `pages/` | URL 상태에 따른 전체 페이지 |
| UI | `components/` | 페이지에서 조합하는 재사용 블록 |
| 데이터 | `api/` | Supabase CRUD만 (React 없음) |
| 인프라 | `lib/` | 클라이언트·localStorage |
| 로직 | `hooks/`, `utils/` | 상태·정렬·(2차) 파싱 |
| 타입 | `types/` | DB row / 폼 input 타입 |
| 상수 | `constants/` | 앱명·캐릭터 목록 |

---

## 기획 화면 → 파일

| 기획 | 파일 |
|------|------|
| 보드 생성 | `HomePage.tsx` + `boardApi.ts` |
| 보드 메인 | `BoardPage.tsx` + `PlaceCard.tsx` |
| 장소 추가 | `AddPlaceForm.tsx` + `placeApi.ts` |
| 투표 현황 | `sortPlaces.ts` + `likes.ts` |
| 프로필 | `ProfilePage.tsx` + `profile.ts` |

---

## 데이터 흐름

```
[HomePage]
  └─ boardApi.createBoard(name)
       └─ Supabase rooms INSERT
            └─ navigate ?room={uuid}

[ProfilePage]
  └─ profile.saveProfile({ nickname, character })
       └─ localStorage
            └─ navigate ?room={uuid} (setup 제거)

[BoardPage]
  └─ useBoard(roomId)
       └─ placeApi.listPlaces(roomId)
  └─ AddPlaceForm → placeApi.addPlace (+ uploadImage)
  └─ PlaceCard → placeApi.likePlace / deletePlace
       └─ likes.ts (내 좋아요 여부)
```

---

## DB (Supabase)

| 테이블 / 버킷 | 컬럼·용도 (요약) |
|---------------|------------------|
| `rooms` | `id`, `name` |
| `places` | `room_id`, `url`, `image`, `likes`, `poster_name`, `poster_char` |
| Storage `image` | 장소 업로드 사진 |

---

## place-board 초안과의 대응

기획 문서의 `place-board/` 구조와 현재 코드베이스 매핑:

| 초안 | 현재 (GOTogether) |
|------|-------------------|
| `roomApi.ts` | `api/boardApi.ts` |
| `Home.tsx` | `pages/HomePage.tsx` |
| `Board.tsx` | `pages/BoardPage.tsx` |
| *(없음)* | `pages/ProfilePage.tsx` (추가됨) |
| `lib/profile.ts`, `lib/likes.ts` | 동일 개념, `lib/`에 분리 |
| `hooks/` | `useBoard`, `useToast` 추가 |
