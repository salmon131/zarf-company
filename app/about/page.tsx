import Card from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-500 mb-4">
            브랜드 스토리
          </h1>
          <p className="text-lg text-gray-700">
            만화로 투자 감각을 깨우는 zarf-company
          </p>
        </section>

        {/* Philosophy */}
        <section className="mb-16">
          <Card className="p-8 bg-brand-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              만화로 투자 감각을 깨우다
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              zarf-company는 복잡하고 어려운 투자 지식을 만화와 영상으로
              쉽고 재미있게 전달합니다. 투자에 관심은 있지만 어디서부터
              시작해야 할지 모르는 분들을 위해, 단계별로 구성된 콘텐츠와
              오프라인 커뮤니티를 제공합니다.
            </p>
            <p className="text-gray-700 leading-relaxed">
              우리의 목표는 모든 사람이 투자에 대한 자신감을 갖고, 올바른
              투자 습관을 기를 수 있도록 돕는 것입니다.
            </p>
          </Card>
        </section>

        {/* Founder Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">대표 소개</h2>
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto md:mx-0">
                <span className="text-4xl">👤</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  대표 이름
                </h3>
                <p className="text-gray-600 mb-4">
                  투자 교육 전문가로서 10년 이상의 경험을 바탕으로, 복잡한
                  투자 지식을 누구나 이해할 수 있도록 만화와 영상으로
                  전달하는 일을 하고 있습니다.
                </p>
                <div className="text-sm text-gray-500">
                  <p>• 투자 교육 전문가</p>
                  <p>• 금융권 경력 10년+</p>
                  <p>• 투자 콘텐츠 크리에이터</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">팀 소개</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["만화 작가", "영상 제작", "커뮤니티 운영"].map((role, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="text-4xl mb-4">👨‍💼</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {role} 팀
                </h3>
                <p className="text-gray-600 text-sm">
                  전문성과 열정으로 최고의 콘텐츠를 만들어갑니다
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Location */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">오시는 길</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">주소</h3>
                <p className="text-gray-700">서울 강동구 고덕로 97(암사동 447-24) 2층 카페탱</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">교통편</h3>
                <p className="text-gray-700">
                 암사역사공원역 2번 출구에서 도보 5분 거리
                </p>
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">지도 영역</span>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

