"use client";

import DocumentBar from "./DocumentBar";
import DocumentSection from "./DocumentSection";
import { useMyDocuments } from "@/features/document/application/hooks/useGetMyDocuments";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const DocumentPageLayout = () => {
  const { recent, shared, isLoading, error } = useMyDocuments();

  if (isLoading) {
    return <p className="p-6 text-muted-foreground">Loading documents...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">Failed to load documents</p>;
  }

  if (!recent.length && !shared.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Image
          src="/icons/empty-doc.svg"
          alt="empty"
          width={220}
          height={220}
        />
        <p className="mt-4 text-muted-foreground">
          You don’t have any documents yet
        </p>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Create document
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <DocumentBar />

      <div className="min-h-screen bg-white border rounded-lg p-6 space-y-8">
        <DocumentSection title="Recent documents" documents={recent} />
        <DocumentSection title="Shared with you" documents={shared} />
      </div>
    </div>
  );
};

export default DocumentPageLayout;
