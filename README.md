# GOTogether

> 카카오톡 방에서 링크 하나로 모이는, 친구들이 함께 장소를 추가하고 투표하는 공유 보드

네이버 지도 링크·사진을 한곳에 모아 두고, 좋아요 순으로 약속 장소를 정하는 웹 앱입니다.  
앱 설치 없이 링크(`?room=`)만으로 참여합니다.

> 팀원 프로토타입(`reference/index.html`)을 **Vite + React 19 + TypeScript**로 이전한 버전입니다.  
> 기획 가칭명: PlaceBoard → 현재 코드베이스명: **GOTogether**

---

## 문제 정의

**Pain Point:** "내가 저장한 거 보내는 건 되는데, 친구들이랑 같이 고르는 건 안 됨"

- 네이버 지도는 장소 리스트 **공유(읽기 전용)** 만 가능 → 친구가 추가·반응 불가
- 카톡방에 링크가 여러 개 흩어지면 비교·결정이 어려움
- 투표/리액션이 없어 최종 결정까지 대화가 길어짐

**핵심 가치**

- 설치 없이 링크로 바로 참여
- 네이버 지도 링크 붙여넣기 → 장소 카드로 등록 (OG 자동 파싱은 2차)
- 모두가 추가 + 좋아요 투표 → 한눈에 순위 확인

---

## 핵심 화면 ↔ 코드 매핑

| 화면 (기획) | 설명                                     | 코드                                    |
| ----------- | ---------------------------------------- | --------------------------------------- |
| 보드 생성   | 방 이름 입력 + 고유 링크 생성            | `pages/HomePage.tsx`                    |
| 프로필 설정 | 캐릭터·닉네임 (참여자 식별)              | `pages/ProfilePage.tsx`                 |
| 보드 메인   | 장소 카드 목록 (썸네일, 링크, 좋아요 수) | `pages/BoardPage.tsx`                   |
| 장소 추가   | 네이버 링크 + 사진 업로드                | `components/AddPlaceForm.tsx`           |
| 투표 현황   | 좋아요 순 정렬                           | `utils/sortPlaces.ts`                   |
| 결과 보기   | 1위 하이라이트                           | _(2차 — 현재는 좋아요순 목록으로 대체)_ |

---

## 기술 스택

| 영역        | 기술                                                                                              | 비고                        |
| ----------- | ------------------------------------------------------------------------------------------------- | --------------------------- |
| 프론트      | Vite + React 19 + TypeScript                                                                      | SPA                         |
| 라우팅      | react-router-dom                                                                                  | `?room=` 쿼리 기반          |
| 스타일      | CSS (커스텀)                                                                                      | 프로토타입 UI 유지          |
| DB / 백엔드 | [Supabase](https://supabase.com/dashboard/project/brepbtqutqbkzymsifst)                           | `rooms`, `places`, Storage  |
| 배포        | [Vercel](https://vercel.com/hyeonjungnohs-projects/gotogether-react/BDgTXtSGQsLn5kCTCua5cdzJRStp) | `npm run build` → 정적 배포 |
| 상태        | React hooks + Context                                                                             | 전역 상태 라이브러리 없음   |

---

## 배포 · 대시보드

| 항목                    | 링크                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| **서비스 (Production)** | https://gotogether-react.vercel.app/                                                                           |
| **Vercel 배포**         | [Deployment Overview](https://vercel.com/hyeonjungnohs-projects/gotogether-react/BDgTXtSGQsLn5kCTCua5cdzJRStp) |
| **Supabase 프로젝트**   | [Dashboard](https://supabase.com/dashboard/project/brepbtqutqbkzymsifst)                                       |

---

## MVP 기능 현황

- [x] 방 생성 + 공유 링크 복사 (`?room=`)
- [x] 프로필 (캐릭터 + 닉네임, localStorage)
- [x] 장소 추가 (네이버 URL + 선택 사진 업로드)
- [x] 좋아요 / 좋아요순 정렬
- [x] 장소 삭제 (확인 모달 + Storage 정리)
- [x] 링크 공유 · 새로고침
- [ ] 네이버 링크 OG 자동 파싱 (`utils/fetchPlaceInfo.ts` 스텁)
- [ ] 실시간 업데이트 (Supabase Realtime)
- [ ] 1위 장소 하이라이트 UI

---

## 시작하기

```bash
npm install
cp .env.example .env   # Supabase URL · anon key 입력
npm run dev            # http://localhost:5173
```

빌드:

```bash
npm run build
npm run preview
```

---

## 폴더 구조

```
GOTogether/
├── reference/                      # 이전 단일 HTML 프로토타입 (참고용, Vite 빌드 제외)
│   ├── index.html                  #   GoTogether 원본 UI·동작
│   └── README.md                   #   reference 폴더 설명
│
├── src/
│   ├── main.tsx                    # React 진입점 — Router · ToastProvider 마운트
│   ├── App.tsx                     # ?room= 쿼리로 홈 / 프로필 / 보드 화면 분기
│   ├── index.css                   # 전역 스타일 (프로토타입 CSS 이전)
│   ├── vite-env.d.ts               # Vite 환경 변수 타입 (VITE_SUPABASE_*)
│   │
│   ├── pages/                      # 화면 단위 (기획의 보드 생성·메인·프로필)
│   │   ├── HomePage.tsx            #   방 이름 입력 → Supabase rooms 생성 → 링크 복사
│   │   ├── ProfilePage.tsx         #   캐릭터·닉네임 설정 (localStorage 저장)
│   │   └── BoardPage.tsx           #   장소 보드 — 목록·추가·좋아요·삭제
│   │
│   ├── components/                 # 재사용 UI 조각
│   │   ├── Header.tsx              #   로고, 방 이름, 내 프로필 뱃지
│   │   ├── CharPicker.tsx          #   캐릭터 선택 그리드
│   │   ├── AddPlaceForm.tsx        #   네이버 링크 + 사진 업로드 폼
│   │   ├── PlaceCard.tsx           #   장소 카드 1개 (썸네일·좋아요·삭제)
│   │   ├── DeletePlaceModal.tsx    #   장소 삭제 확인 모달
│   │   ├── BoardBottomBar.tsx      #   링크 공유 · 새로고침 하단 바
│   │   └── Toast.tsx               #   토스트 알림 UI
│   │
│   ├── hooks/
│   │   ├── useToast.tsx            #   전역 토스트 Context + useToast 훅
│   │   └── useBoard.ts             #   방 장소 목록 fetch · 상태 관리
│   │
│   ├── api/                        # Supabase 호출만 (UI 없음)
│   │   ├── boardApi.ts             #   rooms 테이블 — 방 생성 · 조회
│   │   └── placeApi.ts             #   places 테이블 — 추가 · 조회 · 좋아요 · 삭제 · 이미지 업로드
│   │
│   ├── lib/                        # 앱 공통 인프라
│   │   ├── supabase.ts             #   Supabase 클라이언트 싱글톤 (.env 연동)
│   │   ├── profile.ts              #   닉네임·캐릭터 localStorage 읽기/쓰기
│   │   └── likes.ts                #   방별 내가 누른 좋아요 ID localStorage
│   │
│   ├── types/                      # TypeScript 타입
│   │   ├── board.ts                #   Board (rooms 테이블 row)
│   │   └── place.ts                #   Place, AddPlaceInput
│   │
│   ├── constants/
│   │   ├── branding.ts             #   앱 이름 등 브랜딩 상수
│   │   └── characters.ts           #   캐릭터 목록 · 이모지 헬퍼
│   │
│   └── utils/
│       ├── sortPlaces.ts           #   좋아요 수 기준 내림차순 정렬
│       └── fetchPlaceInfo.ts       #   (2차) 네이버 링크 OG 파싱 스텁
│
├── dist/                           # npm run build 결과 (git 제외 권장)
├── index.html                      # Vite HTML 엔트리
├── vite.config.ts                  # Vite 설정
├── tsconfig.json                   # TypeScript 프로젝트 참조
├── tsconfig.app.json               #   src/ 앱용 TS 설정
├── tsconfig.node.json              #   vite.config.ts용 TS 설정
├── package.json
├── package-lock.json
├── .env.example                    # 환경 변수 예시 (커밋용)
├── .env                            # 실제 Supabase 키 (git 제외)
├── .gitignore
├── README.md                       # 이 문서
└── STRUCTURE.md                    # 폴더 구조 · 데이터 흐름 상세
```

---

## URL 규칙

| URL                           | 화면                               |
| ----------------------------- | ---------------------------------- |
| `/`                           | 홈 — 방 만들기                     |
| `/?room={uuid}`               | 프로필 없으면 프로필 → 있으면 보드 |
| `/?room={uuid}&setup=profile` | 방 만든 직후 프로필 설정           |

---

## 데이터 흐름 (간단)

1. **홈** → `boardApi.createBoard` → URL `?room={id}` + 클립보드 복사
2. **프로필** → `lib/profile` 저장 → 보드로 이동
3. **보드** → `useBoard` / `placeApi` → 카드 렌더 · 좋아요 · Storage 업로드

### Supabase 테이블

| 테이블 / 버킷   | 용도                               |
| --------------- | ---------------------------------- |
| `rooms`         | 방 id, name                        |
| `places`        | 장소 url, image, likes, poster\_\* |
| Storage `image` | 장소 사진                          |

---

## 제외 범위 (Out of scope · 2차)

- 네이버 OG 자동 파싱 (CORS → Serverless/Edge Function 예정)
- Supabase Realtime 실시간 동기화
- 1위 장소 하이라이트 전용 화면
- Tailwind 마이그레이션
- 앱 설치 / 별도 인증 (링크 보유 = 참여)

---

## 참고

- Supabase `anon` key는 클라이언트에 노출됩니다. **RLS**로 테이블 접근을 제한하세요.
- `.env`는 git에 올리지 마세요.
- 폴더·파일 역할 상세: [STRUCTURE.md](./STRUCTURE.md)

## 라이선스

Private / 팀 프로젝트

## jira

- Jira integration test
