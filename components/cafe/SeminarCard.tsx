import Link from "next/link";
import Card from "@/components/ui/Card";

interface SeminarCardProps {
  title: string;
  date: string;
  instructor?: string;
  description?: string;
  imageUrl?: string;
  href: string;
  price?: string;
}

export default function SeminarCard({
  title,
  date,
  instructor,
  description,
  imageUrl,
  href,
  price,
}: SeminarCardProps) {
  return (
    <Link href={href}>
      <Card hover className="h-full border-0 shadow-md hover:shadow-xl">
        {imageUrl && (
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="mb-2">
          <span className="text-base text-brand-600 font-bold">{date}</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        {instructor && (
          <p className="text-base text-gray-700 mb-2 font-semibold">강사: {instructor}</p>
        )}
        {description && (
          <p className="text-gray-700 text-base mb-3 line-clamp-2 font-semibold">
            {description}
          </p>
        )}
        {price && (
          <div className="mt-4 pt-4 border-t border-gray-200/30">
            <span className="text-xl font-bold text-brand-500">{price}</span>
          </div>
        )}
      </Card>
    </Link>
  );
}

