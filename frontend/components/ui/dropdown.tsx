"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  closeDropdown: () => void;
}

const DropdownContext = React.createContext<DropdownContextValue | undefined>(
  undefined
);

export interface DropdownProps {
  children: React.ReactNode;
  className?: string;
}

export function Dropdown({ children, className }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const closeDropdown = React.useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
    triggerRef.current?.focus();
  }, []);

  // Click outside listener
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Keyboard navigation handler
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDropdown();
        return;
      }

      const items = menuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]:not([disabled])'
      );
      if (!items || items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev + 1 >= items.length ? 0 : prev + 1;
          items[next]?.focus();
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev - 1 < 0 ? items.length - 1 : prev - 1;
          items[next]?.focus();
          return next;
        });
      } else if (e.key === "Home") {
        e.preventDefault();
        items[0]?.focus();
        setActiveIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        items[items.length - 1]?.focus();
        setActiveIndex(items.length - 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeDropdown]);

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        setIsOpen,
        activeIndex,
        setActiveIndex,
        triggerRef,
        menuRef,
        closeDropdown,
      }}
    >
      <div className={cn("relative inline-block text-left", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export interface DropdownTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

export function DropdownTrigger({ children }: DropdownTriggerProps) {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("DropdownTrigger must be used within Dropdown");

  const { isOpen, setIsOpen, triggerRef } = context;

  const handleClick = (e: React.MouseEvent) => {
    children.props.onClick?.(e);
    setIsOpen((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    children.props.onKeyDown?.(e);
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return React.cloneElement(children, {
    ref: triggerRef,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    "aria-haspopup": "menu",
    "aria-expanded": isOpen,
  });
}

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right";
}

export function DropdownMenu({
  className,
  align = "left",
  children,
  ...props
}: DropdownMenuProps) {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenu must be used within Dropdown");

  const { isOpen, menuRef } = context;

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-orientation="vertical"
      className={cn(
        "absolute z-50 mt-2 min-w-[12rem] rounded-md border border-border bg-card p-1 text-card-foreground shadow-md animate-in fade-in zoom-in-95 duration-100",
        align === "right" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "danger";
  icon?: React.ReactNode;
}

export function DropdownItem({
  className,
  variant = "default",
  icon,
  children,
  onClick,
  disabled,
  ...props
}: DropdownItemProps) {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("DropdownItem must be used within Dropdown");

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
    context.closeDropdown();
  };

  return (
    <button
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-body-sm font-medium transition-colors text-left",
        "focus-visible:outline-none focus-visible:bg-muted focus-visible:ring-1 focus-visible:ring-brand-blue",
        variant === "default" &&
          "text-foreground hover:bg-muted hover:text-foreground",
        variant === "danger" &&
          "text-danger hover:bg-danger/10 focus-visible:bg-danger/10",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {icon && <span className="h-4 w-4 shrink-0 text-current">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
}

export function DropdownDivider({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
    />
  );
}
