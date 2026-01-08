"use client";

import React, { useEffect, useRef, useState } from "react";

export const PageManager = ({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLDivElement>;
}) => {
  const [pages, setPages] = useState<HTMLElement[][]>([]);

  useEffect(() => {
    if (!contentRef || !contentRef.current) return;

    const children = Array.from(contentRef.current.children) as HTMLElement[];

    const result: HTMLElement[][] = [[]];
    let pageIndex = 0;

    children.forEach((el) => {
      if (el.dataset.pageBreak !== undefined) {
        result.push([]);
        pageIndex++;
      } else {
        result[pageIndex].push(el);
      }
    });

    setPages(result);
  });

  return (
    <div className="flex flex-col items-center gap-16">
      {pages.map((blocks, i) => (
        <div
          key={i}
          className="bg-white shadow-lg"
          style={{ width: 794, minHeight: 1123, padding: 96 }}
        >
          {blocks.map((el, idx) => (
            <div key={idx} dangerouslySetInnerHTML={{ __html: el.outerHTML }} />
          ))}
          <div className="absolute bottom-4 right-4 text-xs">Page {i + 1}</div>
        </div>
      ))}
    </div>
  );
};
