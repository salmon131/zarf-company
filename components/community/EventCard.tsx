import Link from "next/link";
import Card from "@/components/ui/Card";

interface EventCardProps {
  title: string;
  date: string;
  description?: string;
  imageUrl?: string;
  href?: string;
  type?: "online" | "offline";
}

export default function EventCard({
  title,
  date,
  description,
  imageUrl,
  href,
  type,
}: EventCardProps) {
  const content = (
    <Card hover={!!href} className="h-full">
      {imageUrl && (
        <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-brand-600 font-medium">{date}</span>
        {type && (
          <span
            className={`text-xs px-2 py-1 rounded ${
              type === "online"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {type === "online" ? "온라인" : "오프라인"}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
      )}
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

