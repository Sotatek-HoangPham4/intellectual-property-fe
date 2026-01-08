import { Descendant } from "slate";

export const A4 = {
  width: 794,
  height: 1123,
  padding: 80,
  contentHeight: 1123 - 160,
};

export type PageNode = {
  type: "page";
  children: Descendant[];
};

export type ParagraphNode = {
  type: "paragraph";
  children: { text: string }[];
};
