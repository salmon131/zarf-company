import Card from "@/components/ui/Card";

interface CafeCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  address?: string;
  hours?: string;
  phone?: string;
}

export default function CafeCard({
  title,
  description,
  imageUrl,
  address,
  hours,
  phone,
}: CafeCardProps) {
  return (
    <Card className="h-full">
      {imageUrl && (
        <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      <div className="space-y-2 text-sm">
        {address && (
          <div className="flex items-start">
            <span className="text-gray-500 w-20">주소</span>
            <span className="text-gray-700">{address}</span>
          </div>
        )}
        {hours && (
          <div className="flex items-start">
            <span className="text-gray-500 w-20">운영시간</span>
            <span className="text-gray-700">{hours}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-start">
            <span className="text-gray-500 w-20">전화</span>
            <span className="text-gray-700">{phone}</span>
          </div>
        )}
      </div>
      {/* 네이버 지도 임베드 */}
      <div className="mt-6 rounded-lg overflow-hidden shadow-md">
        <iframe
          src="https://naver.me/FhfREQzF"
          width="100%"
          height="600"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          className="w-full"
          title="네이버 지도"
        ></iframe>
      </div>
    </Card>
  );
}

