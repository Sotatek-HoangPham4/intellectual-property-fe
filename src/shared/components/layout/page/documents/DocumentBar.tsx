"use client";

import { Button } from "@/components/ui/button";
import { useCreateDocument } from "@/features/document/application/hooks/useCreateDocument";
import { FolderPlus, Loader2, Plus, Signature, Upload } from "lucide-react";
import React from "react";

const DocumentBar = () => {
  const { createDocument, isLoading } = useCreateDocument();
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        className="h-20 w-36 flex-col items-start gap-4"
        onClick={createDocument}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <Plus />}
        <p>Create Document</p>
      </Button>

      <Button
        variant={"outline"}
        className="h-20 w-36 flex-col items-start gap-4"
      >
        <Upload />
        <p>Upload or Drop</p>
      </Button>
      <Button
        variant={"outline"}
        className="h-20 w-36 flex-col items-start gap-4"
      >
        <FolderPlus />
        <p>Create Folder</p>
      </Button>
      <Button
        variant={"outline"}
        className="h-20 w-36 flex-col items-start gap-4"
      >
        <Signature />
        <p>Signatures</p>
      </Button>
    </div>
  );
};

export default DocumentBar;
