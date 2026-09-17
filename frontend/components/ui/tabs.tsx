"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (val: string) => void;
  tabIdPrefix: string;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : internalValue;
  const tabIdPrefix = React.useId();

  const setActiveTab = React.useCallback(
    (newVal: string) => {
      if (!isControlled) {
        setInternalValue(newVal);
      }
      onValueChange?.(newVal);
    },
    [isControlled, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, tabIdPrefix }}>
      <div className={cn("w-full space-y-4", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, children, ...props }: TabsListProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const triggers = listRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]:not([disabled])'
    );
    if (!triggers || triggers.length === 0) return;

    const activeIndex = Array.from(triggers).indexOf(
      document.activeElement as HTMLButtonElement
    );
    if (activeIndex === -1) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (activeIndex + 1) % triggers.length;
      triggers[nextIndex]?.focus();
      triggers[nextIndex]?.click();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex =
        (activeIndex - 1 + triggers.length) % triggers.length;
      triggers[prevIndex]?.focus();
      triggers[prevIndex]?.click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground border border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({
  value,
  className,
  children,
  disabled,
  ...props
}: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const { activeTab, setActiveTab, tabIdPrefix } = context;
  const isSelected = activeTab === value;
  const triggerId = `${tabIdPrefix}-tab-${value}`;
  const contentId = `${tabIdPrefix}-content-${value}`;

  return (
    <button
      id={triggerId}
      role="tab"
      type="button"
      disabled={disabled}
      aria-selected={isSelected}
      aria-controls={contentId}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-3.5 py-1.5 text-body-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue",
        "disabled:pointer-events-none disabled:opacity-50 select-none",
        isSelected
          ? "bg-card text-foreground shadow-sm font-semibold"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  const { activeTab, tabIdPrefix } = context;
  const isSelected = activeTab === value;
  const triggerId = `${tabIdPrefix}-tab-${value}`;
  const contentId = `${tabIdPrefix}-content-${value}`;

  if (!isSelected) return null;

  return (
    <div
      id={contentId}
      role="tabpanel"
      aria-labelledby={triggerId}
      tabIndex={0}
      className={cn(
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 animate-in fade-in-50 duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
