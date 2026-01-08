import { createEditor, Editor } from "slate";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";

const EMPTY_DOCUMENT = [
  {
    type: "page",
    children: [
      {
        type: "paragraph",
        children: [{ text: "Type something here" }],
      },
    ],
  },
];

class EditorManager {
  private static instance: EditorManager;
  editor: Editor;
  value: any[];

  private constructor() {
    this.editor = withHistory(withReact(createEditor()));

    this.editor.children = EMPTY_DOCUMENT;

    this.value = EMPTY_DOCUMENT;
  }

  static getInstance() {
    if (!EditorManager.instance) {
      EditorManager.instance = new EditorManager();
    }
    return EditorManager.instance;
  }
}

export const editorManager = EditorManager.getInstance();
