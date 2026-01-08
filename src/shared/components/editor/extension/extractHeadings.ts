import { Descendant } from "slate";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const extractHeadings = (content: Descendant[]): TocItem[] => {
  const result: TocItem[] = [];

  content.forEach((page: any, pageIndex) => {
    page.children?.forEach((node: any, index: number) => {
      if (node.type === "heading") {
        const text = node.children?.map((t: any) => t.text).join("");

        result.push({
          id: `heading-${node.level}-${index}`,
          text,
          level: node.level,
        });
      }
    });
  });

  return result;
};
