import Link from "next/link";
import Card from "@/components/ui/Card";

interface StudyCardProps {
  title: string;
  topic: string;
  deadline?: string;
  capacity?: string;
  description?: string;
  href?: string;
  status?: "recruiting" | "full" | "closed" | "ongoing";
}

export default function StudyCard({
  title,
  topic,
  deadline,
  capacity,
  description,
  href,
  status = "recruiting",
}: StudyCardProps) {
  const statusConfig = {
    recruiting: {
      label: "모집중",
      color: "bg-green-100 text-green-700",
    },
    full: {
      label: "정원마감",
      color: "bg-yellow-100 text-yellow-700",
    },
    closed: {
      label: "모집마감",
      color: "bg-gray-100 text-gray-700",
    },
    ongoing: {
      label: "진행중",
      color: "bg-blue-100 text-blue-700",
    },
  };

  const content = (
    <Card hover={!!href} className="h-full border-0 shadow-md hover:shadow-xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-brand-600">{topic}</span>
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${statusConfig[status].color}`}
            >
              {statusConfig[status].label}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        </div>
      </div>
      {description && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-2 font-semibold">
          {description}
        </p>
      )}
      <div className="space-y-2 pt-4 border-t border-gray-200/30">
        {deadline && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">모집 마감:</span>
            <span>{deadline}</span>
          </div>
        )}
        {capacity && (() => {
          const isMinimum = capacity.startsWith("최소");
          const capacityValue = isMinimum ? capacity.replace("최소 ", "") : capacity;
          const label = isMinimum 
            ? "최소 인원:" 
            : (status === "ongoing" ? "참여 인원:" : "모집 인원:");
          
          return (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{label}</span>
              <span>{capacityValue}</span>
            </div>
          );
        })()}
      </div>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

