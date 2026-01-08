"use client";

import { useSlate } from "slate-react";

import {
  toggleMark,
  setFontSize,
  setFontFamily,
  isMarkActive,
  undo,
  redo,
  toggleAlignment,
  setTextColor,
} from "./extension/formatting";
import { Editor } from "slate";
import { Button } from "@/components/ui/button";
import {
  AlignJustify,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Redo,
  Undo,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import colors from "tailwindcss/colors";
import { HeadingSelect } from "./HeadingSelect";

export default function Toolbar({ editor }: { editor: Editor }) {
  //   const editor = useSlate();

  const fonts = ["Arial", "Times New Roman", "Courier New", "Roboto"];
  const fontSizes = [10, 12, 14, 16, 18, 24, 32];

  return (
    <div className="flex gap-2">
      <div className="w-full flex items-center gap-4">
        <div className="w-fit flex items-center gap-2">
          <div className="">
            <p>Page:</p>
          </div>
          <Button size={"icon"} variant={"outline"} className="h-8 w-8">
            1
          </Button>
          <p>of</p>
          <Button size={"icon"} variant={"outline"} className="h-8 w-8">
            1
          </Button>

          <div className="w-[1px] h-8 bg-muted-foreground/20"></div>

          <HeadingSelect editor={editor} />

          <Select
            defaultValue="Arial"
            onValueChange={(value) => setFontFamily(editor, value)}
          >
            <SelectTrigger size="sm" className="w-40">
              <SelectValue placeholder="Font" />
            </SelectTrigger>

            <SelectContent>
              {fonts.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue="10"
            onValueChange={(value) => setFontSize(editor, parseInt(value))}
          >
            <SelectTrigger size="sm" className="w-20">
              <SelectValue placeholder="Size" />
            </SelectTrigger>

            <SelectContent>
              {fontSizes.map((s) => (
                <SelectItem key={s} value={s.toString()}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-[1px] h-8 bg-muted-foreground/20"></div>

          <div className="flex gap-1">
            {/* Bold */}
            <Button
              variant={isMarkActive(editor, "bold") ? "default" : "ghost"}
              size={"icon-sm"}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, "bold");
              }}
              className="w-8 h-8"
              // className={
              //   isMarkActive(editor, "bold") ? "font-bold bg-gray-300" : ""
              // }
            >
              <Bold />
            </Button>

            {/* Italic */}
            <Button
              variant={isMarkActive(editor, "bold") ? "default" : "ghost"}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, "italic");
              }}
              className="w-8 h-8"
            >
              <Italic />
            </Button>

            {/* Underline */}
            <Button
              variant={isMarkActive(editor, "bold") ? "default" : "ghost"}
              size={"icon-sm"}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, "underline");
              }}
              className="w-8 h-8"
            >
              <p className="text-lg">U</p>
            </Button>
          </div>

          <div className="w-[1px] h-8 bg-muted-foreground/20"></div>

          {/* Undo / Redo */}
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onMouseDown={(e) => {
              e.preventDefault();
              undo(editor);
            }}
          >
            <Undo />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onMouseDown={(e) => {
              e.preventDefault();
              redo(editor);
            }}
          >
            <Redo />
          </Button>

          <div className="w-[1px] h-8 bg-muted-foreground/20"></div>

          {/* Alignment */}
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleAlignment(editor, "left");
            }}
          >
            <AlignLeft />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleAlignment(editor, "center");
            }}
          >
            <AlignCenter />
          </Button>

          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleAlignment(editor, "right");
            }}
          >
            <AlignRight />
          </Button>

          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleAlignment(editor, "justify");
            }}
          >
            <AlignJustify />
          </Button>

          <div className="w-[1px] h-8 bg-muted-foreground/20"></div>

          {/* Text color */}
          {/* {colors.map((c) => (
            <Button
              key={c}
              style={{ backgroundColor: c, width: 24, height: 24 }}
              onMouseDown={(e) => {
                e.preventDefault();
                setTextColor(editor, c);
              }}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
}
