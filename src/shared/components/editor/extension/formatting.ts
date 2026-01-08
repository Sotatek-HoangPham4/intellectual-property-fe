import {
  Editor,
  Transforms,
  Text,
  Element as SlateElement,
  BaseEditor,
} from "slate";
import { HistoryEditor } from "slate-history";
import { nanoid } from "nanoid";

// ----- Types -----
export interface CustomText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}

export interface HeadingElement extends SlateElement {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  align?: "left" | "center" | "right" | "justify";
  children: CustomText[];
}

export interface ParagraphElement extends SlateElement {
  type: "paragraph";
  align?: "left" | "center" | "right" | "justify";
  children: CustomText[];
}

export type CustomElement = ParagraphElement | SlateElement; // có thể mở rộng page, heading

export type CustomEditor = BaseEditor & HistoryEditor;

// ----- Marks -----

export const isMarkActive = (editor: Editor, format: keyof CustomText) => {
  if (!editor.selection) return false;

  // 🔥 selection invalid → bỏ qua
  if (!Editor.hasPath(editor, editor.selection.anchor.path)) {
    return false;
  }

  try {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n[format] === true,
      universal: true,
    });

    return !!match;
  } catch {
    return false;
  }
};

export const toggleMark = (editor: Editor, format: keyof CustomText) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
};

// export const isMarkActive = (editor: Editor, format: keyof CustomText) => {
//   const [match] = Editor.nodes(editor, {
//     match: (n) => Text.isText(n) && n[format] === true,
//     universal: true,
//   });
//   return !!match;
// };

export const setFontSize = (editor: Editor, size: number) => {
  Editor.addMark(editor, "fontSize", size);
};

export const setFontFamily = (editor: Editor, font: string) => {
  Editor.addMark(editor, "fontFamily", font);
};

export const setTextColor = (editor: Editor, color: string) => {
  Editor.addMark(editor, "color", color);
};

// ----- Alignment -----
// Narrow type Node để TS hiểu
const isParagraphElement = (n: SlateElement | any): n is ParagraphElement =>
  SlateElement.isElement(n) && n.type === "paragraph";

export const toggleAlignment = (
  editor: Editor,
  align: "left" | "center" | "right" | "justify"
) => {
  Transforms.setNodes<ParagraphElement>(
    editor,
    { align }, // ✅ TS biết align tồn tại trên ParagraphElement
    {
      match: (n): n is ParagraphElement => isParagraphElement(n),
      split: true,
    }
  );
};

// ----- Undo / Redo -----
export const undo = (editor: CustomEditor) => editor.undo();
export const redo = (editor: CustomEditor) => editor.redo();

// ----- Block helpers -----
export const isBlockActive = (editor: Editor, type: string, level?: number) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      SlateElement.isElement(n) &&
      n.type === type &&
      (level ? (n as any).level === level : true),
  });

  return !!match;
};

export const toggleHeading = (editor: Editor, level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const isActive = isBlockActive(editor, "heading", level);

  Transforms.setNodes(
    editor,
    isActive
      ? {
          type: "paragraph",
          align: undefined,
          level: undefined,
          id: undefined,
        }
      : {
          type: "heading",
          level,
          id: nanoid(), // ✅ ID BẤT BIẾN
        },
    {
      match: (n) =>
        SlateElement.isElement(n) &&
        Editor.isBlock(editor, n) &&
        n.type !== "page", // 🚫 KHÔNG đụng page
    }
  );

  // 🔥 REMOVE fontSize mark khi dùng heading
  Editor.removeMark(editor, "fontSize");
};
