import { Document } from "@/features/document/domain/models/document";
import DocumentCard from "./DocumentCard";

interface Props {
  title: string;
  documents: Document[];
}

const DocumentSection = ({ title, documents }: Props) => {
  if (!documents.length) return null;

  return (
    <section className="space-y-4">
      <p className="font-medium text-base">{title}</p>

      <div className="grid grid-cols-4 gap-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </section>
  );
};

export default DocumentSection;
