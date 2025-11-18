import Link from "next/link";
import Card from "@/components/ui/Card";

interface VideoCardProps {
  title: string;
  thumbnailUrl?: string;
  views?: number;
  duration?: string;
  href: string;
  category?: string;
}

export default function VideoCard({
  title,
  thumbnailUrl,
  views,
  duration,
  href,
  category,
}: VideoCardProps) {
  return (
    <Link href={href} className="block group">
      <Card hover className="h-full overflow-hidden border-0 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl shadow-md">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 relative overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-16 h-16"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          )}
          {/* 플레이 오버레이 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </div>
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-semibold">
              {duration}
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-sm">
          {category && (
            <span className="px-3 py-1 bg-gradient-to-r from-brand-100 to-orange-100 text-brand-700 rounded-full text-xs font-semibold">
              {category}
            </span>
          )}
          {views !== undefined && (
            <span className="text-gray-600 font-medium flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {views.toLocaleString()}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

