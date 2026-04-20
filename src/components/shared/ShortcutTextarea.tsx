import { forwardRef, useEffect, useRef } from 'react';

interface ShortcutTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSubmitShortcut?: () => void;
  onCancelShortcut?: () => void;
  autoGrow?: boolean;
}

export const ShortcutTextarea = forwardRef<HTMLTextAreaElement, ShortcutTextareaProps>(
  ({ onSubmitShortcut, onCancelShortcut, onKeyDown, autoGrow = true, ...props }, ref) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      if (!innerRef.current) return;
      if (!autoGrow) {
        innerRef.current.style.height = '';
        return;
      }
      innerRef.current.style.height = 'auto';
      innerRef.current.style.height = `${innerRef.current.scrollHeight}px`;
    }, [autoGrow, props.value]);

    return (
      <textarea
        ref={node => {
          innerRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        {...props}
        onKeyDown={e => {
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
  },
);
ShortcutTextarea.displayName = 'ShortcutTextarea';
