"use client";

import React from "react";
import { Editor } from "@tiptap/react";
import { ImageUploadButton } from "./ImageUploadButton";

import {
  Bold,
  Code,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo2,
  TextQuote,
  Underline,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorToolbarProps {
  editor: Editor;
  onImageUpload: (file: File) => void;
  onExportHTML: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onImageUpload,
  onExportHTML,
}) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [linkText, setLinkText] = React.useState("");

  if (!editor) return null;

  const openLinkDialog = () => {
    const currentAttrs = editor.getAttributes("link");
    setLinkUrl(currentAttrs.href || "");
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );
    setLinkText(selectedText || "");
    setIsLinkDialogOpen(true);
  };

  const confirmLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .insertContent(linkText)
        .run();
    }
    setIsLinkDialogOpen(false);
  };

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const headingOptions = [
    { id: "paragraph", name: "Paragraph" },
    { id: "h1", name: "Heading 1" },
    { id: "h2", name: "Heading 2" },
    { id: "h3", name: "Heading 3" },
  ];

  const handleHeadingChange = (value: string) => {
    const chain = editor.chain().focus();
    if (value === "normal") chain.setParagraph().run();
    else if (value === "h1") chain.toggleHeading({ level: 1 }).run();
    else if (value === "h2") chain.toggleHeading({ level: 2 }).run();
    else if (value === "h3") chain.toggleHeading({ level: 3 }).run();
  };

  const [selectedKey, setSelectedKey] = React.useState<string | number | null>(
    "1"
  );

  const options = [
    { id: "normal", name: "Normal text" },
    { id: "h1", name: "Heading 1" },
    { id: "h2", name: "Heading 2" },
    { id: "h3", name: "Heading 3" },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center px-2 py-1 border-b shadow-sm h-11">
        {/* Undo / Redo */}
        <div className="flex">
          <Button
            onClick={() => editor.chain().focus().undo().run()}
            // isDisabled={!editor.can().chain().focus().undo().run()}
            size={"icon"}
            variant={"ghost"}
          >
            <Undo2 size={18} />
          </Button>
          <Button
            onClick={() => editor.chain().focus().redo().run()}
            // isDisabled={!editor.can().chain().focus().redo().run()}
            size={"icon"}
            variant={"ghost"}
          >
            <Redo2 size={18} />
          </Button>
        </div>
        <div className="h-7 border"></div>

        {/* Heading */}
        {/* <div className="min-w-32">
                    <BsSelect
                        buttonClassName="border-0 px-2 shadow-none"
                        options={options}
                        placeholder="Normal text"
                        selectedKey={selectedKey}
                        onSelectionChange={key => {
                            setSelectedKey(String(key))
                            handleHeadingChange(String(key))
                        }}
                        renderValue={item => <span className="font-semibold">{item.name}</span>}
                        renderOption={item => <span>{item.name}</span>}
                        isClearable
                    />
                </div> */}

        <div className="h-7 border"></div>

        {/* Formatting */}
        <div className="flex">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            size={"icon"}
            variant={"ghost"}
          >
            <Bold size={16} />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            size={"icon"}
            variant={"ghost"}
          >
            <Italic size={16} />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            size={"icon"}
            variant={"ghost"}
          >
            <Underline size={18} className="mt-0.5" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            size={"icon"}
            variant={"ghost"}
            className="btn line-through"
          >
            <p className="text-lg">S</p>
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            size={"icon"}
            variant={"ghost"}
          >
            <Code size={16} />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            size={"icon"}
            variant={"ghost"}
          >
            <Quote size={16} />
          </Button>
        </div>

        <div className="h-7 border"></div>

        {/* Lists, Quote, Code */}

        <div className="flex">
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            size={"icon"}
            variant={"ghost"}
          >
            <List size={20} />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            size={"icon"}
            variant={"ghost"}
          >
            <ListOrdered size={20} />
          </Button>
        </div>
        <div className="h-7 border"></div>

        {/* Link + Image */}
        <div className="flex">
          <ImageUploadButton onImageSelect={onImageUpload} />
          <Button onClick={handleSetLink} size={"icon"} variant={"ghost"}>
            <Link size={16} />
          </Button>
          {/* <div className="relative">
                        <Button onClick={openLinkDialog} size="icon" variant="ghost">
                            <Link size={16} />
                        </Button>
                    </div> */}
        </div>

        {/* Export */}
        {/* <button onClick={onExportHTML} className="btn bg-indigo-600 text-white">
                Export
            </button> */}
      </div>
    </>
  );
};
