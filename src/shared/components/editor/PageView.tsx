import { ReactNode } from "react";
import { A4 } from "./types";

export function PageView({
  children,
  pageNumber,
}: {
  children: ReactNode;
  pageNumber?: number;
}) {
  return (
    <div
      className="page"
      style={{
        width: A4.width,
        minHeight: A4.height,
        background: "white",
        margin: "24px auto",
        boxShadow: "0 0 4px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // content top, footer bottom
      }}
    >
      <div
        className="page-content"
        style={{
          padding: A4.padding,
          minHeight: A4.contentHeight,
        }}
      >
        {children}
      </div>

      {/* <div
        className="page-footer"
        style={{
          height: 40,
          textAlign: "center",

          fontSize: 12,
          color: "#666",
        }}
      >
        {pageNumber ? `Page ${pageNumber}` : ""}
      </div> */}
    </div>
  );
}
