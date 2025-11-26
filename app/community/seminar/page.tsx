import SeminarCard from "@/components/cafe/SeminarCard";
import Card from "@/components/ui/Card";

const seminars = [
  {
    title: "주식 투자 입문 세미나",
    date: "2024.12.15 (토) 14:00",
    instructor: "김투자",
    description: "처음 시작하는 주식 투자자를 위한 기초 강의",
    href: "/community/seminar/stock-basics",
    price: "무료",
  },
  {
    title: "ETF 투자 전략",
    date: "2024.12.22 (토) 14:00",
    instructor: "이ETF",
    description: "ETF를 활용한 안정적인 투자 전략",
    href: "/community/seminar/etf-strategy",
    price: "30,000원",
  },
  {
    title: "투자 심리 마스터하기",
    date: "2025.01.05 (토) 14:00",
    instructor: "박심리",
    description: "투자 심리를 이해하고 실전에 활용하기",
    href: "/community/seminar/investment-psychology",
    price: "40,000원",
  },
  {
    title: "차트 분석 기초",
    date: "2025.01.12 (토) 14:00",
    instructor: "최고수",
    description: "주식 차트를 읽고 분석하는 방법",
    href: "/community/seminar/chart-analysis",
    price: "35,000원",
  },
];

export default function SeminarPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-500 mb-4">
            세미나 일정
          </h1>
          <p className="text-lg text-gray-700">
            다양한 투자 주제의 세미나를 만나보세요
          </p>
        </section>

        {/* Calendar Section */}
        <section className="mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              2024년 12월
            </h2>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
              {/* 간단한 캘린더 그리드 (실제로는 더 복잡한 구현 필요) */}
              {Array.from({ length: 35 }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center text-sm ${
                    i % 7 === 0 || i % 7 === 6
                      ? "text-gray-400"
                      : "text-gray-700"
                  } ${i === 14 ? "bg-brand-100 rounded" : ""}`}
                >
                  {i < 7 ? "" : i - 6}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              * 노란색으로 표시된 날짜에 세미나가 예정되어 있습니다
            </p>
          </Card>
        </section>

        {/* Seminar List */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">예정된 세미나</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seminars.map((seminar, index) => (
              <SeminarCard key={index} {...seminar} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

