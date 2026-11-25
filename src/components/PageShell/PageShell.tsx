import type { PropsWithChildren, ReactNode } from 'react';
import styles from './PageShell.module.css';

interface PageShellProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function PageShell({
  title,
  subtitle,
  actions,
  children,
}: PageShellProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>SITEFLOW</p>
          <h1>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </header>

      {children}
    </main>
  );
}
