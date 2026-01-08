import { Document } from "@/features/document/domain/models/document";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface Props {
  document: Document;
}

const DocumentCard = ({ document }: Props) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/document/${document.id}`)}
      className="border rounded-lg hover:shadow-sm cursor-pointer transition"
    >
      {/* Preview */}
      <div className="h-36 bg-muted rounded-t-lg flex items-center justify-center">
        <Image src="/icons/file.png" alt="file" width={96} height={96} />
      </div>

      {/* Meta */}
      <div className="pl-4 pr-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/icons/file.png" alt="file" width={24} height={24} />
          <div className="space-y-0">
            <p className="font-medium truncate max-w-[180px]">
              {document.metadata?.title ?? "Untitled document"}
            </p>
            <p className="text-xs text-muted-foreground">
              Opened{" "}
              {formatDistanceToNow(new Date(document.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        <EllipsisVertical size={18} className="text-muted-foreground" />
      </div>
    </div>
  );
};

export default DocumentCard;
