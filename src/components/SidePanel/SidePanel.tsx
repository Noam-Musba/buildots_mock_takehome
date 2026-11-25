import type { PropsWithChildren, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './SidePanel.module.css';

interface SidePanelProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose: () => void;
  footer?: ReactNode;
}

export function SidePanel({
  open,
  title,
  onClose,
  footer,
  children,
}: SidePanelProps) {
  if (!open) {
    return null;
  }

  return createPortal(
    <div className={styles.backdrop} onMouseDown={onClose}>
      <section
        className={styles.panel}
        aria-modal="true"
        aria-label={title}
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2>{title}</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close panel"
          >
            ×
          </button>
        </header>

        <div className={styles.content}>{children}</div>

        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </section>
    </div>,
    document.body,
  );
}
