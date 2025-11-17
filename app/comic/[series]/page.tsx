export default function ComicSeriesPage({
  params,
}: {
  params: { series: string };
}) {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-brand-500 mb-8">
          만화 시리즈: {decodeURIComponent(params.series)}
        </h1>
        <p className="text-gray-700">시리즈 상세 내용이 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}

