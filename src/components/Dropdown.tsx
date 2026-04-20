'use client';

// Thin wrapper over @radix-ui/react-dropdown-menu with some default styling and simplified API.

import * as RDM from '@radix-ui/react-dropdown-menu';
import type { ReactNode } from 'react';

import { Check } from 'lucide-react';

export function Dropdown({
  children,
  open,
  onOpenChange,
}: {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <RDM.Root open={open} onOpenChange={onOpenChange} modal={false}>
      {children}
    </RDM.Root>
  );
}

Dropdown.Trigger = function DropdownTrigger({
  children,
  className = '',
  disabled,
  asChild,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  asChild?: boolean;
  'aria-label'?: string;
}) {
  if (asChild) {
    return (
      <RDM.Trigger asChild disabled={disabled}>
        {children}
      </RDM.Trigger>
    );
  }
  return (
    <RDM.Trigger asChild disabled={disabled}>
      <button type="button" disabled={disabled} aria-label={ariaLabel} className={className}>
        {children}
      </button>
    </RDM.Trigger>
  );
};

Dropdown.Menu = function DropdownMenu({
  children,
  className = '',
  align = 'start',
  side = 'bottom',
  sideOffset = 4,
  onOpenAutoFocus,
}: {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  onOpenAutoFocus?: (e: Event) => void;
}) {
  // onOpenAutoFocus is omitted from Radix's public root Content type in 2.1.x,
  // but runtime forwards it to the FocusScope. Cast through to expose it.
  const extraProps = { onOpenAutoFocus } as unknown as RDM.DropdownMenuContentProps;
  return (
    <RDM.Portal>
      <RDM.Content
        align={align}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={`z-[100] rounded-md border border-line bg-surface-overlay shadow-lg py-1 overflow-hidden ${className}`}
        {...extraProps}
      >
        {children}
      </RDM.Content>
    </RDM.Portal>
  );
};

Dropdown.Item = function DropdownItem({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <RDM.Item
      onSelect={() => onClick()}
      className={`w-full min-w-0 flex items-center gap-2 px-2.5 py-1.5 text-sm text-fg hover:bg-surface-hover data-[highlighted]:bg-surface-hover transition-colors outline-none cursor-pointer ${className}`}
    >
      {children}
    </RDM.Item>
  );
};

Dropdown.CheckboxItem = function DropdownCheckboxItem({
  children,
  checked,
  onCheckedChange,
  closeOnSelect = false,
  className = '',
}: {
  children: ReactNode;
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
  closeOnSelect?: boolean;
  className?: string;
}) {
  return (
    <RDM.CheckboxItem
      checked={checked}
      onCheckedChange={onCheckedChange}
      onSelect={e => {
        if (!closeOnSelect) {
          // Prevent closing the menu when clicking a checkbox item
          e.preventDefault();
        }
      }}
      className={`w-full min-w-0 flex items-center gap-2 px-2.5 py-1.5 text-sm text-fg hover:bg-surface-hover data-[highlighted]:bg-surface-hover transition-colors outline-none cursor-pointer ${className}`}
    >
      <div className="flex-shrink-0 w-[14px] flex items-center justify-center">
        <RDM.ItemIndicator>
          <Check size={14} className="text-fg" />
        </RDM.ItemIndicator>
      </div>
      {children}
    </RDM.CheckboxItem>
  );
};

Dropdown.Separator = function DropdownSeparator({ className = '' }: { className?: string }) {
  return <RDM.Separator className={`my-1 h-px bg-border-muted ${className}`} />;
};
