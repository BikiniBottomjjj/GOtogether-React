//버셀 네이버 지도 테스트하기 위해 필요한 api

export default async function handler(req: any, res: any) {
  const { query } = req.query
  const response = await fetch(
    `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query as string)}&display=5`,
    {
      headers: {
        'X-Naver-Client-Id': process.env.VITE_NAVER_MAP_CLIENT_ID!,
        'X-Naver-Client-Secret': process.env.VITE_NAVER_CLIENT_SECRET!,
      },
    }
  )
  const data = await response.json()
  res.status(200).json(data)
}

