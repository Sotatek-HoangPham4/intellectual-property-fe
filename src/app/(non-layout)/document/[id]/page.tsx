"use client";

import React, { useEffect, useRef } from "react";
import DocumentEditor from "@/shared/components/editor/DocumentEditor";
import { editorManager } from "@/shared/components/editor/EditorManager";
import { useParams } from "next/navigation";
import { Editor, Transforms } from "slate";
import {
  useGetDocumentByIdQuery,
  useUpdateDocumentMutation,
} from "@/features/document/infrastructure/api/documentApi";
import { extractHeadings } from "@/shared/components/editor/extension/extractHeadings";
import DocumentOutline from "@/shared/components/editor/DocumentOutline";
import DocumentHeader from "@/shared/components/layout/page/documents/DocumentHeader";
import SignatureSidebar from "@/shared/components/layout/page/documents/SignatureSidebar";
import AIChatButton from "@/shared/components/ai-chat/AIChatButton";
import AIChatPanel from "@/shared/components/ai-chat/AIChatPanel";
import { AIChatProvider } from "@/shared/components/ai-chat/AIChatContext";

const DocumentFilePage = () => {
  const headings = extractHeadings(editorManager.value);

  const params = useParams();
  const documentId = params.id as string;

  const { data: document, isLoading } = useGetDocumentByIdQuery(documentId);

  const editor = editorManager.editor;
  const hydratedRef = useRef(false);

  // useEffect(() => {
  //   if (!document?.content) return;
  //   if (hydratedRef.current) return;

  //   console.log("document.content :", document.content);

  //   // 1. Update editor children
  //   editor.children = document.content as any;

  //   // 2. Update manager value
  //   editorManager.value = document.content as any;

  //   // 3. Set cursor về đầu
  //   Transforms.select(editor, Editor.start(editor, []));

  //   // 4. Force Slate re-render
  //   editor.onChange();

  //   hydratedRef.current = true;
  // }, [document?.id]);

  return (
    <AIChatProvider>
      <div className="w-full h-screen overflow-y-scroll relative bg-muted">
        <DocumentHeader />
        <AIChatButton />
        <AIChatPanel />

        <div className="w-64 z-10 h-screen fixed pt-28 overflow-y-auto">
          <DocumentOutline items={headings} />
        </div>

        <div className="w-64 h-screen fixed bg-background pt-28 border-l right-0 flex flex-col overflow-y-auto">
          <SignatureSidebar />
        </div>

        <div className="w-full min-h-screen py-40 flex justify-center ">
          <DocumentEditor />
        </div>
      </div>
    </AIChatProvider>
  );
};

export default DocumentFilePage;
