"use client";

import React, { useRef } from "react";

import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadButtonProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  onImageSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImageSelect(file);
    e.target.value = "";
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button onClick={handlePickImage} size={"icon"} variant={"ghost"}>
        <Image size={18} />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};
