"use client";

import { Slate, Editable } from "slate-react";
import { JSX, useCallback, useRef } from "react";
import { editorManager } from "./EditorManager";
import { PageView } from "./PageView";
import { paginate } from "./pagination";
import Toolbar from "./ToolBar";
import { useUpdateDocumentMutation } from "@/features/document/infrastructure/api/documentApi";
import { Descendant } from "slate";
import { useParams } from "next/navigation";

export function useDebouncedSave<T>(callback: (value: T) => void, delay = 800) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  return (value: T) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      callback(value);
    }, delay);
  };
}

export default function DocumentEditor() {
  const editor = editorManager.editor;

  const [updateDocument, { isLoading }] = useUpdateDocumentMutation();

  const renderElement = useCallback((props: any) => {
    const { element, attributes, children } = props;
    switch (element.type) {
      case "heading": {
        const Tag = `h${element.level}` as keyof JSX.IntrinsicElements;

        return (
          <Tag
            {...attributes}
            data-heading-id={element.id}
            style={{
              textAlign: element.align ?? "left",
              fontSize: {
                1: "32px",
                2: "28px",
                3: "24px",
                4: "20px",
                5: "18px",
                6: "16px",
              }[element.level],
              fontWeight: 600,
              margin: "16px 0 8px",
            }}
          >
            {children}
          </Tag>
        );
      }

      case "page":
        const pageIndex = editor.children.indexOf(element);
        return (
          <PageView {...attributes} pageNumber={pageIndex + 1}>
            {children}
          </PageView>
        );
      case "paragraph":
        return (
          <p
            {...attributes}
            style={{
              textAlign: element.align ?? "left",
              margin: "8px 0",
            }}
          >
            {children}
          </p>
        );
      default:
        return <div {...attributes}>{children}</div>;
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    const { leaf, attributes, children } = props;
    let styled = children;

    if (leaf.bold) styled = <strong>{styled}</strong>;
    if (leaf.italic) styled = <em>{styled}</em>;
    if (leaf.underline) styled = <u>{styled}</u>;
    if (leaf.fontSize)
      styled = <span style={{ fontSize: leaf.fontSize }}>{styled}</span>;
    if (leaf.fontFamily)
      styled = <span style={{ fontFamily: leaf.fontFamily }}>{styled}</span>;

    return <span {...attributes}>{styled}</span>;
  }, []);

  const params = useParams();
  const documentId = params.id as string;

  console.log(documentId);

  const debouncedSave = useDebouncedSave((value: Descendant[]) => {
    updateDocument({
      id: documentId,
      content: value,
    });
  });

  return (
    <Slate
      editor={editor}
      initialValue={editorManager.value}
      // onChange={(value) => {
      //   console.log("Slate value:", value);

      //   editorManager.value = value;
      //   requestAnimationFrame(() => paginate(editor));
      // }}

      onChange={(value) => {
        editorManager.value = value;
        requestAnimationFrame(() => paginate(editor));
        debouncedSave(value);
      }}
    >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        // placeholder="Start typing..."
        className="focus:outline-none"
      />
    </Slate>
  );
}
