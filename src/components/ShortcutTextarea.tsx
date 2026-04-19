import { forwardRef } from 'react';

interface ShortcutTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSubmitShortcut?: () => void;
  onCancelShortcut?: () => void;
}

export const ShortcutTextarea = forwardRef<HTMLTextAreaElement, ShortcutTextareaProps>(
  ({ onSubmitShortcut, onCancelShortcut, onKeyDown, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            if (onSubmitShortcut) {
              e.preventDefault();
              onSubmitShortcut();
            }
          } else if (e.key === 'Escape') {
            if (onCancelShortcut) {
              e.preventDefault();
              onCancelShortcut();
            }
          }
          // Allow passing an additional onKeyDown if needed
          onKeyDown?.(e);
        }}
      />
    );
  }
);
ShortcutTextarea.displayName = 'ShortcutTextarea';
