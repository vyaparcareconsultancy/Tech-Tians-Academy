"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function AccordionItem({
  id,
  title,
  children,
  isOpen = false,
  onToggle,
  className,
}: AccordionItemProps) {
  const contentId = `accordion-content-${id}`;
  const headerId = `accordion-header-${id}`;

  return (
    <div className={cn("border-b border-border py-2 text-left", className)}>
      <h3>
        <button
          id={headerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={onToggle}
          className="flex w-full items-center justify-between py-4 text-left text-body font-semibold text-foreground transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-md"
        >
          <span>{title}</span>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180 text-brand-blue"
            )}
          />
        </button>
      </h3>
      {isOpen && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={headerId}
          className="pb-4 text-body-sm text-muted-foreground leading-relaxed animate-in fade-in-50 duration-200"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export interface AccordionProps {
  items: { id: string; title: string; content: React.ReactNode }[];
  className?: string;
  allowMultiple?: boolean;
}

export function Accordion({
  items,
  className,
  allowMultiple = false,
}: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<string[]>([items[0]?.id || ""]);

  const handleToggle = (id: string) => {
    setOpenIds((prev) => {
      if (allowMultiple) {
        return prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
      }
      return prev.includes(id) ? [] : [id];
    });
  };

  return (
    <div className={cn("divide-y divide-border", className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          isOpen={openIds.includes(item.id)}
          onToggle={() => handleToggle(item.id)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
