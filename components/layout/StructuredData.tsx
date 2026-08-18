export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CafeTang",
    "alternateName": "카페탱",
    "url": "https://tangzarf.com",
    "description": "편하게 쉬고, 작업하고, 공부할 수 있는 서울 강동구 카공 & 북카페 CafeTang.",
    "inLanguage": "ko-KR",
    "publisher": {
      "@type": "Organization",
      "name": "CafeTang",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tangzarf.com/images/logo.png"
      }
    }
  };

  const cafeData = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": "CafeTang",
    "alternateName": "카페탱",
    "url": "https://tangzarf.com",
    "image": "https://tangzarf.com/images/logo.png",
    "description": "편하게 쉬고, 작업하고, 공부할 수 있는 카공 & 북카페",
    "telephone": "0507-1304-7291",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "서울",
      "addressRegion": "강동구",
      "streetAddress": "고덕로 97(암사동 447-24) 2층 카페탱",
      "addressCountry": "KR"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "22:00"
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cafeData) }}
      />
    </>
  );
}
