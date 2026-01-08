"use client";

import { useEffect, useRef, useState } from "react";
import { TocItem } from "./extension/extractHeadings";
import { cn } from "@/shared/lib/utils";
import { ArrowLeft, ListTree } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentOutline({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true); // <- state show/hide
  const observerRef = useRef<IntersectionObserver | null>(null);

  // CLICK → scroll
  const handleClick = (id: string) => {
    const el = document.querySelector(
      `[data-heading-id="${id}"]`
    ) as HTMLElement | null;

    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setActiveId(id);
  };

  // SCROLL → detect active heading
  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll("[data-heading-id]")
    ) as HTMLElement[];

    if (!headings.length) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const id = visible[0].target.getAttribute("data-heading-id");
          if (id) setActiveId(id);
        }
      },
      {
        root: null,
        rootMargin: "-100px 0px -70% 0px",
        threshold: 0.1,
      }
    );

    headings.forEach((h) => observerRef.current!.observe(h));

    return () => observerRef.current?.disconnect();
  }, [items]);

  return (
    <div className="p-4 pr-0 text-sm">
      {/* Button toggle show/hide */}
      <Button
        variant={isOpen ? "ghost" : "outline"}
        size={"icon"}
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-full transition"
      >
        {isOpen ? <ArrowLeft /> : <ListTree />}
      </Button>

      {/* Outline items */}
      {isOpen && (
        <div className="mt-4">
          <div className=" rounded-full bg-background border h-9 flex items-center gap-2 px-3 pr-2 font-medium w-fit">
            <ListTree size={20} />
            <p className="py-2">
              Document Tabs
              <span className="text-xs p-1 rounded-full bg-muted px-2 ml-2">
                {items.length}
              </span>
            </p>
          </div>
          <div className="pl-5 pt-2">
            {items.map((item) => {
              const isActive = item.id === activeId;

              return (
                <div
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    "group relative cursor-pointer py-0.5 transition-colors",
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  style={{
                    paddingLeft: `${item.level * 16}px`,
                  }}
                >
                  {/* ONE LEFT LINE (ALL LEVELS, INCLUDING H1) */}
                  <span
                    className={cn(
                      "absolute left-0 inset-y-0 w-[2px] rounded-sm transition-colors",
                      isActive
                        ? "bg-primary"
                        : "bg-border group-hover:bg-border/80"
                    )}
                  />

                  <p className="p-1">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
