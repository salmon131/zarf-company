import Link from "next/link";
import Image from "next/image";
import CafeCard from "@/components/cafe/CafeCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function CafePage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-500 mb-4">
            투자자들의 아지트
          </h1>
          <p className="text-lg text-gray-700">
            카페탱에서 만나는 투자 커뮤니티
          </p>
        </section>

        {/* About Section */}
        <section className="mb-16">
          <CafeCard
            title="카페탱"
            description="투자자들이 모여 함께 배우고 성장하는 공간입니다. 오프라인 세미나와 스터디를 통해 실전 투자 감각을 키워보세요."
            address="서울 강동구 고덕로 97(암사동 447-24) 2층 카페탱"
            hours="매일 09:00 - 01:00"
            phone="010-4026-7291"
          />
        </section>

        {/* Photo Gallery */}
        <section className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {["공부", "만화", "회의실", "무인카페", "하루종일", "자유롭게"].map((tag, index) => (
              <span
                key={index}
                className="text-gray-700 hover:text-brand-600 transition-all duration-300 font-bold text-base md:text-lg px-3 py-2 rounded-lg hover:bg-brand-50/50 relative group cursor-default"
              >
                #{tag}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-0 overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gray-100 relative overflow-hidden" style={{ aspectRatio: '16 / 13.5' }}>
                  <Image
                    src={`/images/cafe/cafe-${i}.jpg`}
                    alt={`카페 사진 ${i}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="p-8 bg-brand-50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              세미나 일정 확인하기
            </h3>
            <p className="text-gray-700 mb-6">
              다양한 투자 주제의 세미나를 만나보세요
            </p>
            <Button href="/cafe/seminar" variant="primary" size="lg">
              세미나 일정 보기
            </Button>
          </Card>
        </section>
      </div>
    </div>
  );
}

