import Card from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 그라데이션 섹션 */}
      <div className="bg-gradient-to-b from-brand-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-[1.2] relative">
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                브랜드 스토리
              </span>
              {/* 텍스트 외곽선 효과로 가독성 향상 */}
              <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent blur-sm opacity-20 -z-10">
                브랜드 스토리
              </span>
            </h1>
            <p className="text-lg text-gray-700">
              만화로 투자 감각을 깨우는 자프 컴퍼니
            </p>
          </section>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">

        {/* Philosophy */}
        <section className="mb-16">
          <Card className="p-8 bg-brand-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 group cursor-default inline-block relative">
              <span className="group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                만화를 통한 우리들의 주식 이야기
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </h2>
            <div className="space-y-6">
              <div>
            <p className="text-gray-700 leading-relaxed mb-4">
                  자프 컴퍼니는 회원 50명으로 구성된 투자 커뮤니티에서 시작되었습니다. 
                  함께 주식투자를 공부하고 실전 투자를 경험하며, 투자 여정을 함께 걸어왔습니다.
            </p>
            <p className="text-gray-700 leading-relaxed">
                  이 경험을 바탕으로, 복잡하고 어려운 투자 지식을 만화와 영상으로 
                  재미있게 전달하는 콘텐츠를 제작하게 되었습니다.
                </p>
              </div>
              
              <div className="border-t border-brand-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 group cursor-default inline-block relative">
                  <span className="group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    솔직하고 공감하는 주식 투자를 만화로 풀어내다
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  우리는 투자자의 실제 경험과 감정을 솔직하게 담아 만화로 스토리를 전개합니다. 
                  성공뿐만 아니라 실패와 시행착오도 함께 그려내어, 투자자들이 공감하고 
                  배울 수 있는 콘텐츠를 만들어갑니다.
                </p>
              </div>

              <div className="border-t border-brand-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 group cursor-default inline-block relative">
                  <span className="group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    우리의 목표
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  모든 사람이 투자에 대한 자신감을 갖고, 올바른 
                  투자 습관을 기를 수 있도록 돕는 것입니다. 만화와 스토리텔링을 통해 
                  투자가 더 이상 어렵고 멀게 느껴지지 않도록, 함께 성장하는 투자 커뮤니티를 만들어갑니다.
            </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Founder Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 group cursor-default inline-block relative">
            <span className="group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              대표 소개
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
          </h2>
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto md:mx-0 overflow-hidden flex-shrink-0">
                <img 
                  src="/images/ceo-profile.jpg" 
                  alt="김종환 대표" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group cursor-default inline-block relative">
                  <span className="group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    김종환
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                </h3>
                <p className="text-gray-600 mb-4 font-medium">
                  부동산 자산투자 및 개발 전문가 · 투자콘텐츠 크리에이터 · (주)자프컴퍼니 대표
                </p>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 group cursor-default inline-block relative">
                      <span className="group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        커리어 & 경력
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                    </h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>• 교보생명, LG그룹, KT&G 등 국내 대기업에서 25년간 자산개발(Real Estate Development) 및 투자 관련 업무 수행</li>
                      <li>• 풍부한 현장경험을 바탕으로 부동산·금융의 복합적 시각을 갖춘 전문가</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 group cursor-default inline-block relative">
                      <span className="group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        학력
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                    </h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>• 건국대학교 부동산학과 학사</li>
                      <li>• 건국대학교 금융·투자 석사 (M.S.)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 group cursor-default inline-block relative">
                      <span className="group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        기업 활동
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                    </h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>• 2025년 (주)자프컴퍼니 설립</li>
                      <li>• 주식경제만화 '탱자프' 시리즈 제작(유튜브 '25.10월)</li>
                      <li>• 투자교육 기반의 크리에이티브 콘텐츠 기업 운영</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 group cursor-default inline-block relative">
                      <span className="group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        투자 성과
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                    </h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>• 퇴직연금 계좌 2년 수익률: +50%</li>
                      <li>• 개인 주식투자 5년 평균 연복리 수익률: 약 +45% (총 228% 성과)</li>
                      <li>• 투자방식: 퀀트&모멘텀</li>
                      <li>• 정량·정성 분석 기반의 '포워드 EPS + RSI 중심 투자철학' 구축</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 group cursor-default inline-block relative">
            <span className="group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              팀 소개
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["만화 작가", "영상 제작", "커뮤니티 운영"].map((role, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="text-4xl mb-4">👨‍💼</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group cursor-default inline-block relative">
                  <span className="group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {role} 팀
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 group cursor-default inline-block relative">
            <span className="group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              오시는 길
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
          </h2>
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
              {/* 네이버 지도 임베드 */}
              <div className="mt-6 rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://naver.me/FhfREQzF"
                  width="100%"
                  height="300"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen
                  className="w-full"
                  title="네이버 지도"
                ></iframe>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

