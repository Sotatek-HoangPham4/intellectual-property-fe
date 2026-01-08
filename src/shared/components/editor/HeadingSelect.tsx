"use client";

import { Transforms } from "slate";
import { Editor, Element as SlateElement } from "slate";
import { toggleHeading } from "./extension/formatting";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React from "react";

const HEADING_OPTIONS = [
  { label: "Normal text", value: "paragraph" },
  { label: "Heading 1", value: 1 },
  { label: "Heading 2", value: 2 },
  { label: "Heading 3", value: 3 },
  { label: "Heading 4", value: 4 },
];

export function HeadingSelect({ editor }: { editor: Editor }) {
  // Lấy current heading type để hiển thị value hiện tại
  const getCurrentHeading = () => {
    if (!editor.selection) return "paragraph";

    // 🔥 selection invalid → không đọc
    if (!Editor.hasPath(editor, editor.selection.anchor.path)) {
      return "paragraph";
    }

    try {
      const [match] = Editor.nodes(editor, {
        match: (n) =>
          SlateElement.isElement(n) &&
          Editor.isBlock(editor, n) &&
          (n.type === "paragraph" || n.type === "heading"),
      });

      return match ? (match[0] as any).type : "paragraph";
    } catch {
      return "paragraph";
    }
  };

  const [value, setValue] = React.useState<string | number>(
    getCurrentHeading()
  );

  return (
    <Select
      value={value}
      onValueChange={(val) => {
        setValue(val);
        if (val === "paragraph") {
          Transforms.setNodes(editor, { type: "paragraph" });
        } else {
          toggleHeading(editor, Number(val) as 1 | 2 | 3 | 4 | 5 | 6);
        }
      }}
    >
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Heading" />
      </SelectTrigger>
      <SelectContent>
        {HEADING_OPTIONS.map((opt) => (
          <SelectItem key={opt.label} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
