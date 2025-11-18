import Link from "next/link";
import ComicCard from "@/components/comic/ComicCard";
import CharacterCard from "@/components/comic/CharacterCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ComicPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-500 mb-4">
            주식만화 세계관
          </h1>
          <p className="text-lg text-gray-700">
            만화로 쉽고 재미있게 배우는 투자 이야기
          </p>
        </section>

        {/* Series Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">시리즈</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ComicCard
              title="이상한 녀석들의 주식투자 - 탱자프"
              description="만화로 쉽고 재미있게 배우는 주식 투자 이야기"
              href="/comic/tangzarf"
              tags={["실전", "만화"]}
              imageUrl="/images/comic/tangzarf/cover.jpg"
            />
            <ComicCard
              title="주식 투자 첫걸음"
              description="처음 시작하는 주식 투자자를 위한 기초 만화"
              href="/comic/stock-basics"
              tags={["입문", "기초"]}
            />
            <ComicCard
              title="ETF 마스터"
              description="ETF 투자를 만화로 배우는 시리즈"
              href="/comic/etf-master"
              tags={["ETF", "중급"]}
            />
            <ComicCard
              title="투자 심리학"
              description="투자 심리를 이해하는 만화"
              href="/comic/investment-psychology"
              tags={["심리", "고급"]}
            />
          </div>
        </section>

        {/* Character Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">캐릭터</h2>
            <Link
              href="/comic/characters"
              className="text-brand-500 hover:text-brand-600 font-medium"
            >
              캐릭터 도감 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CharacterCard
              name="김투자"
              description="주식 투자 입문자"
              href="/comic/characters#kim"
              featuredIn={["주식 투자 첫걸음"]}
            />
            <CharacterCard
              name="이ETF"
              description="ETF 전문가"
              href="/comic/characters#lee"
              featuredIn={["ETF 마스터"]}
            />
            <CharacterCard
              name="박심리"
              description="투자 심리 전문가"
              href="/comic/characters#park"
              featuredIn={["투자 심리학"]}
            />
            <CharacterCard
              name="최고수"
              description="베테랑 투자자"
              href="/comic/characters#choi"
              featuredIn={["주식 투자 첫걸음", "ETF 마스터"]}
            />
          </div>
        </section>

        {/* Notice Section */}
        <section>
          <Card className="p-8 text-center bg-brand-50">
            <div className="text-4xl mb-4">⏸️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              현재 휴재 중입니다
            </h3>
            <p className="text-gray-700 mb-6">
              새로운 에피소드 업데이트 알림을 받아보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button variant="primary">알림 신청</Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

