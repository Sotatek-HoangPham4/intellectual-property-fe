import { Editor, Node, Transforms, Path } from "slate";
import { ReactEditor } from "slate-react";
import { A4 } from "./types";

export function paginate(editor: Editor) {
  requestAnimationFrame(() => {
    const pages = editor.children;

    for (let i = 0; i < pages.length; i++) {
      let height = 0;

      for (let j = 0; j < pages[i].children.length; j++) {
        const blockPath: Path = [i, j];
        const block = Node.get(editor, blockPath);

        let dom: HTMLElement;
        try {
          dom = ReactEditor.toDOMNode(editor, block);
        } catch {
          return; // 🔥 DOM chưa sẵn sàng
        }

        const blockHeight = dom.getBoundingClientRect().height;

        if (height + blockHeight > A4.contentHeight) {
          if (!pages[i + 1]) {
            Transforms.insertNodes(
              editor,
              { type: "page", children: [] },
              { at: [i + 1] }
            );
          }

          const newPath: Path = [i + 1, 0];
          Transforms.moveNodes(editor, { at: blockPath, to: newPath });

          Transforms.select(editor, Editor.start(editor, newPath));
          ReactEditor.focus(editor);
          return;
        }

        height += blockHeight;
      }
    }
  });
}
