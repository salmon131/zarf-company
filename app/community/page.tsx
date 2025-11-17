import Link from "next/link";
import Button from "@/components/ui/Button";
import EventCard from "@/components/community/EventCard";
import Card from "@/components/ui/Card";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-500 mb-4">
            투자 스터디 & 커뮤니티
          </h1>
          <p className="text-lg text-gray-700">
            함께 배우고 성장하는 투자 커뮤니티
          </p>
        </section>

        {/* Join Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">💬</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                온라인 커뮤니티
              </h2>
              <p className="text-gray-600 mb-6">
                카카오톡 오픈채팅방과 디스코드에서 실시간으로 투자 이야기를
                나눠보세요
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  카톡 오픈채팅 참여
                </Button>
                <Button variant="outline" size="lg">
                  디스코드 참여
                </Button>
              </div>
            </Card>
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                오프라인 스터디
              </h2>
              <p className="text-gray-600 mb-6">
                카페탱에서 정기적으로 열리는 투자 스터디에
                참여해보세요
              </p>
              <Button href="/cafe" variant="primary" size="lg">
                스터디 일정 보기
              </Button>
            </Card>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">갤러리</h2>
            <Link
              href="/community/gallery"
              className="text-brand-500 hover:text-brand-600 font-medium"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EventCard
              title="12월 투자 스터디"
              date="2024.12.10"
              description="ETF 투자 전략에 대해 함께 공부했습니다"
              type="offline"
              href="/community/gallery#dec-study"
            />
            <EventCard
              title="온라인 투자 세미나"
              date="2024.12.05"
              description="온라인으로 진행된 투자 심리 세미나"
              type="online"
              href="/community/gallery#dec-seminar"
            />
            <EventCard
              title="11월 모임"
              date="2024.11.28"
              description="카페에서 만난 투자자들의 모임"
              type="offline"
              href="/community/gallery#nov-meetup"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="p-8 bg-brand-50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              커뮤니티에 참여하세요
            </h3>
            <p className="text-gray-700 mb-6">
              투자에 관심 있는 사람들과 함께 배우고 성장해보세요
            </p>
            <Button variant="primary" size="lg">
              지금 참여하기
            </Button>
          </Card>
        </section>
      </div>
    </div>
  );
}

