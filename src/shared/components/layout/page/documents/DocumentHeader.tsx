"use client";

import { NavUser } from "@/components/nav-user";
import { Input } from "@/components/ui/input";
import {
  BriefcaseBusiness,
  Building,
  Calendar,
  CaseSensitive,
  Check,
  Eye,
  FilePlus,
  Files,
  List,
  Mail,
  MinusCircle,
  Move,
  PlusCircle,
  RotateCcw,
  RotateCw,
  Signature,
  Star,
  Trash,
  Trash2,
  User,
  UserPlus,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PiTextAlignJustify } from "react-icons/pi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/shared/components/editor/RichTextEditor";
import { PageManager } from "@/shared/components/editor/PageManager";
import Link from "next/link";
import DocumentEditor from "@/shared/components/editor/DocumentEditor";
import { editorManager } from "@/shared/components/editor/EditorManager";
import Toolbar from "@/shared/components/editor/ToolBar";
import { useParams } from "next/navigation";
import { Editor, Transforms } from "slate";
import {
  useGetDocumentByIdQuery,
  useUpdateDocumentMutation,
} from "@/features/document/infrastructure/api/documentApi";
import toast from "react-hot-toast";
import { extractHeadings } from "@/shared/components/editor/extension/extractHeadings";
import DocumentOutline from "@/shared/components/editor/DocumentOutline";

const normalizeContent = (content: any[]) => {
  if (!content || content.length === 0) {
    return [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ];
  }

  return content.map((node) => ({
    ...node,
    children:
      node.children && node.children.length > 0
        ? node.children
        : [{ text: "" }],
  }));
};

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
};
const DocumentHeader = () => {
  const [title, setTitle] = useState("");
  const [updateDocument] = useUpdateDocumentMutation();

  const params = useParams();
  const documentId = params.id as string;

  const { data: document, isLoading } = useGetDocumentByIdQuery(documentId);
  console.log(document?.metadata!);

  const editor = editorManager.editor;
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!document?.content) return;
    if (hydratedRef.current) return;

    setTitle(document?.metadata?.title ?? "");

    const normalizedContent = normalizeContent(document.content);

    // 1. Update editor children
    editor.children = normalizedContent as any;

    // 2. Sync manager
    editorManager.value = normalizedContent as any;

    // 3. Move cursor SAFELY
    setTimeout(() => {
      try {
        const end = Editor.end(editor, []);
        Transforms.select(editor, end);
      } catch (e) {
        console.warn("Cannot set selection:", e);
      }
    }, 0);

    // 4. Force re-render
    editor.onChange();

    hydratedRef.current = true;
  }, [document?.id]);

  const handleSave = async () => {
    try {
      await updateDocument({
        id: documentId,
        title,
        content: editorManager.value,
      }).unwrap();

      toast.success("Document saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save document.");
    }
  };

  return (
    <div className="fixed w-[calc(100vw)] z-50">
      <div className="h-16 w-full bg-white flex items-center justify-between px-4 pr-6">
        <div className="w-full flex items-center gap-2">
          <Link href={"/document"}>
            <Image src={"/icons/file.png"} alt="file" width={36} height={36} />
          </Link>
          <div className="w-full -space-y-1 -mt-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled document"
              style={{
                fontSize: 18,
              }}
              className="p-0 shadow-none border-none text:text-2xl font-medium w-full truncate"
            />

            <p className="text-xs text-muted-foreground">
              Last updated{" "}
              {document?.updatedAt
                ? new Date(document.updatedAt).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour12: false,
                    timeZone: "Asia/Ho_Chi_Minh",
                  })
                : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"outline"}>
            <UserPlus /> Share
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Check /> Save
          </Button>
          {/* <Avatar className="h-8 w-8 rounded-full">
               <AvatarImage src={data.user.avatar} alt={data.user.name} />
               <AvatarFallback className="rounded-lg">CN</AvatarFallback>
             </Avatar> */}
        </div>
      </div>
      <div className="h-12 w-full bg-white border-b  flex items-center  justify-between  px-6">
        <Toolbar editor={editor} />
        <div className="w-[1px] h-8 bg-muted-foreground/20"></div>
        <div className="w-fit flex items-center ml-2">
          <Button size={"icon"} variant={"ghost"}>
            <MinusCircle />
          </Button>
          <Button size={"icon"} variant={"ghost"}>
            <PlusCircle />
          </Button>
          <Button className="w-fit" size={"sm"} variant={"outline"}>
            100%
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;
