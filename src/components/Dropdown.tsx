import React, { createContext, useContext, useState, useRef, useEffect } from "react";

type DropdownContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("Dropdown compound components must be used within Dropdown");
  return context;
}

export function Dropdown({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className={`relative inline-block ${className}`}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

Dropdown.Trigger = function DropdownTrigger({
  children,
  className = "",
  disabled,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const { setOpen } = useDropdown();
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-haspopup="menu"
      className={className}
    >
      {children}
    </button>
  );
};

Dropdown.Menu = function DropdownMenu({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useDropdown();
  if (!open) return null;
  return (
    <div
      role="menu"
      className={`absolute z-10 rounded-md border border-border bg-bg-overlay shadow-lg py-1 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

Dropdown.Item = function DropdownItem({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  const { setOpen } = useDropdown();
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onClick();
        setOpen(false);
      }}
      className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-sm text-text hover:bg-bg-hover transition-colors ${className}`}
    >
      {children}
    </button>
  );
};
