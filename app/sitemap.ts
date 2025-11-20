import { MetadataRoute } from 'next'
import { CHANNEL_HANDLE, videoConfigs } from '@/lib/video-data'
import { getChannelVideos, getChannelPlaylists } from '@/lib/youtube-api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tangzarf.com'
  const sitemapEntries: MetadataRoute.Sitemap = []

  // 정적 페이지들
  sitemapEntries.push(
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/video`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/comic`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cafe`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cafe/seminar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/community/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/b2b`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    }
  )

  // 만화 시리즈 페이지
  const comicSeries = ['tangzarf', 'chipinside']
  comicSeries.forEach((series) => {
    sitemapEntries.push({
      url: `${baseUrl}/comic/${encodeURIComponent(series)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  })

  // 탱자프 만화 에피소드 페이지
  const tangzarfEpisodes = [
    { filename: '최종탱인트로25.9.16.jpg', date: '2025-09-16' },
    { filename: '최종다모탱1화25.9.16훈민.jpg', date: '2025-09-16' },
    { filename: '최종다모탱2화25.9.16훈민.jpg', date: '2025-09-16' },
    { filename: '최종다모탱3화25.9.16훈민.jpg', date: '2025-09-16' },
    { filename: '최종다모탱4화25.9.16훈민.jpg', date: '2025-09-16' },
    { filename: '최종다모탱5화25.9.16_훈민.jpg', date: '2025-09-16' },
    { filename: '최종다모탱6화25.9.17훈민.jpg', date: '2025-09-17' },
    { filename: '최종다모탱7화25.917훈민.jpg', date: '2025-09-17' },
    { filename: '최종다모탱8화25.9.17훈민.jpg', date: '2025-09-17' },
    { filename: '최종다모탱9화25.9.17훈민.jpg', date: '2025-09-17' },
    { filename: '최종다모탱10화25.9.17.훈민.jpg', date: '2025-09-17' },
    { filename: '최종다모탱11화25.9.17훈민.jpg', date: '2025-09-17' },
    { filename: '최종다모탱12화25.9.17훈민.jpg', date: '2025-09-17' },
    { filename: '탱etf0917훈민.jpg', date: '2025-09-17' },
  ]

  tangzarfEpisodes.forEach((episode) => {
    sitemapEntries.push({
      url: `${baseUrl}/comic/${encodeURIComponent('tangzarf')}/${encodeURIComponent(episode.filename)}`,
      lastModified: new Date(episode.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })

  // 세미나 상세 페이지
  const seminars = [
    { slug: 'stock-basics', date: '2024-12-15' },
    { slug: 'etf-strategy', date: '2024-12-22' },
    { slug: 'investment-psychology', date: '2025-01-05' },
    { slug: 'chart-analysis', date: '2025-01-12' },
  ]

  seminars.forEach((seminar) => {
    sitemapEntries.push({
      url: `${baseUrl}/cafe/seminar/${seminar.slug}`,
      lastModified: new Date(seminar.date),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  // YouTube 비디오 페이지들 (동적)
  try {
    // 채널에서 영상 가져오기
    if (CHANNEL_HANDLE) {
      const channelVideos = await getChannelVideos(CHANNEL_HANDLE, 50)
      channelVideos.forEach((video) => {
        sitemapEntries.push({
          url: `${baseUrl}/video/${video.id}`,
          lastModified: new Date(video.publishedAt),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      })

      // 재생목록 가져오기
      const playlists = await getChannelPlaylists(CHANNEL_HANDLE, 20)
      playlists.forEach((playlist) => {
        sitemapEntries.push({
          url: `${baseUrl}/video/playlist/${playlist.id}`,
          lastModified: new Date(playlist.publishedAt),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      })
    }

    // 수동으로 추가한 영상들
    videoConfigs.forEach((config) => {
      sitemapEntries.push({
        url: `${baseUrl}/video/${config.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  } catch (error) {
    console.error('Sitemap 생성 중 비디오 데이터 가져오기 실패:', error)
    // 에러가 발생해도 기본 페이지들은 포함
  }

  return sitemapEntries
}

