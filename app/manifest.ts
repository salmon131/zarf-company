import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '탱자프 - 만화로 배우는 투자',
    short_name: '탱자프',
    description: '탱자프 대표의 투자 노하우와 최신 트렌드를 담은 재밌고 유익한 주식투자 만화와 영상',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8F0',
    theme_color: '#F59E0B',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

