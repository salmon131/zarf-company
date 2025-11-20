export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "탱자프",
    "alternateName": "zarf-company",
    "url": "https://tangzarf.com",
    "description": "탱자프 대표의 투자 노하우와 최신 트렌드를 담은 재밌고 유익한 주식투자 만화와 영상",
    "inLanguage": "ko-KR",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://tangzarf.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "탱자프",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tangzarf.com/images/logo.png"
      }
    }
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "탱자프",
    "url": "https://tangzarf.com",
    "logo": "https://tangzarf.com/images/logo.png",
    "description": "데이터 기반 퀀트 분석으로 실전 투자 전략을 제공하는 투자 교육 플랫폼",
    "sameAs": [
      "https://www.youtube.com/@tangzarf",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["Korean"]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </>
  );
}

