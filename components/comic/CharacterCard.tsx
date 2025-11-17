import Link from "next/link";
import Card from "@/components/ui/Card";

interface CharacterCardProps {
  name: string;
  description?: string;
  imageUrl?: string;
  href?: string;
  featuredIn?: string[];
}

export default function CharacterCard({
  name,
  description,
  imageUrl,
  href,
  featuredIn,
}: CharacterCardProps) {
  const content = (
    <Card hover={!!href} className="h-full text-center">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="text-gray-400 text-2xl">👤</div>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
      {description && (
        <p className="text-gray-600 text-sm mb-3">{description}</p>
      )}
      {featuredIn && featuredIn.length > 0 && (
        <div className="text-xs text-gray-500">
          등장: {featuredIn.join(", ")}
        </div>
      )}
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

