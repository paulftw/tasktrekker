'use client';

// Thin wrapper over @radix-ui/react-dropdown-menu. Keeps a compound
// Dropdown.Trigger / Dropdown.Menu / Dropdown.Item API so pickers stay
// readable, while Radix handles portaling, collision flipping, focus
// management, and keyboard nav.

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
}: {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
}) {
  return (
    <RDM.Portal>
      <RDM.Content
        align={align}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={`z-[100] rounded-md border border-border bg-bg-overlay shadow-lg py-1 overflow-hidden ${className}`}
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
      className={`w-full min-w-0 flex items-center gap-2 px-2.5 py-1.5 text-sm text-text hover:bg-bg-hover data-[highlighted]:bg-bg-hover transition-colors outline-none cursor-pointer ${className}`}
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
      onSelect={(e) => {
        if (!closeOnSelect) {
          // Prevent closing the menu when clicking a checkbox item
          e.preventDefault();
        }
      }}
      className={`w-full min-w-0 flex items-center gap-2 px-2.5 py-1.5 text-sm text-text hover:bg-bg-hover data-[highlighted]:bg-bg-hover transition-colors outline-none cursor-pointer ${className}`}
    >
      <div className="flex-shrink-0 w-[14px] flex items-center justify-center">
        <RDM.ItemIndicator>
          <Check size={14} className="text-text" />
        </RDM.ItemIndicator>
      </div>
      {children}
    </RDM.CheckboxItem>
  );
};
