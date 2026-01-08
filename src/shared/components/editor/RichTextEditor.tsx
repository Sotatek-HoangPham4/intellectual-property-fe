"use client";

import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";

import { PageBreak } from "./extension/PageBreak";
import { EditorToolbar } from "./EditorToolbar";
import { PageManager } from "./PageManager";

const PAGE_HEIGHT = 1123;
const PAGE_PADDING = 96;
const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING * 2;

export const RichTextEditor = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link,
      Highlight,
      PageBreak,
      Placeholder.configure({
        placeholder: "Start writing your content...",
      }),
      CharacterCount.configure({ limit: 10000 }),
    ],
    content: "<p></p>",
    onUpdate({ editor }) {
      if (contentRef.current) {
        paginate(editor, contentRef.current);
      }
    },
  });

  return (
    <>
      {/* <EditorToolbar editor={editor} /> */}

      <EditorContent ref={contentRef} editor={editor} className="tiptap" />

      <PageManager contentRef={contentRef} />
    </>
  );
};

/* ---------------- Pagination Engine ---------------- */

function paginate(editor: any, contentEl: HTMLElement) {
  const blocks = Array.from(contentEl.children) as HTMLElement[];

  let height = 0;
  let needBreak = false;

  blocks.forEach((block) => {
    if (block.dataset.pageBreak !== undefined) {
      height = 0;
      return;
    }

    height += block.offsetHeight;

    if (height > CONTENT_HEIGHT) {
      needBreak = true;
    }
  });

  if (needBreak) {
    editor.chain().focus().insertContent({ type: "pageBreak" }).run();
  }
}
