import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function B2BPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 그라데이션 섹션 */}
      <div className="bg-gradient-to-b from-brand-50 to-white py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-[1.2] relative">
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                타겟 투자자를 모으는 콘텐츠 미디어
              </span>
              {/* 텍스트 외곽선 효과로 가독성 향상 */}
              <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent blur-sm opacity-20 -z-10">
                타겟 투자자를 모으는 콘텐츠 미디어
              </span>
            </h1>
            <p className="text-lg text-gray-700">
              만화 + 영상 + 오프라인으로 만나는 투자자 커뮤니티
            </p>
          </section>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">

        {/* Target Profile */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            독자/시청자 프로필
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">연령대</h3>
              <p className="text-gray-600">20대 ~ 40대</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">관심사</h3>
              <p className="text-gray-600">투자, 재테크, 자산관리</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">활동</h3>
              <p className="text-gray-600">온라인 콘텐츠 소비, 오프라인 모임</p>
            </Card>
          </div>
        </section>

        {/* Ad Products */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            광고 상품
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card hover className="p-6">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                웹툰 협찬
              </h3>
              <p className="text-gray-600 mb-4">
                만화 콘텐츠 내 자연스러운 제품/서비스 노출
              </p>
            </Card>
            <Card hover className="p-6">
              <div className="text-3xl mb-4">🎥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                영상 협찬
              </h3>
              <p className="text-gray-600 mb-4">
                투자 영상 내 제품 리뷰 및 소개
              </p>
            </Card>
            <Card hover className="p-6">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                캐릭터 활용 광고
              </h3>
              <p className="text-gray-600 mb-4">
                브랜드 캐릭터를 활용한 마케팅
              </p>
            </Card>
            <Card hover className="p-6">
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                세미나 협업
              </h3>
              <p className="text-gray-600 mb-4">
                오프라인 세미나 공간 및 이벤트 협업
              </p>
            </Card>
          </div>
        </section>

        {/* Case Study */}
        <section className="mb-16">
          <Card className="p-8 bg-brand-50 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              파일럿 제휴 모집
            </h3>
            <p className="text-gray-700 mb-6">
              새로운 파트너십을 통해 함께 성장할 기회를 찾고 있습니다
            </p>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              제휴 문의
            </h3>
            <p className="text-gray-700 mb-6">
              B2B 제휴 및 광고 문의는 아래로 연락주세요
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <input
                type="text"
                placeholder="회사명"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="email"
                placeholder="이메일"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <textarea
                placeholder="문의 내용"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button variant="primary" size="lg" className="w-full">
                문의하기
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

