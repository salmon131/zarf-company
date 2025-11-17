import Link from "next/link";
import Card from "@/components/ui/Card";

interface ComicCardProps {
  title: string;
  description?: string;
  href: string;
  imageUrl?: string;
  tags?: string[];
}

export default function ComicCard({
  title,
  description,
  href,
  imageUrl,
  tags,
}: ComicCardProps) {
  return (
    <Link href={href}>
      <Card hover className="h-full">
        <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-gray-400 text-sm">이미지 준비 중</div>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-brand-100 text-brand-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}

