import styles from './EmptyState.module.css';

export function EmptyState({ children }: { children: string }) {
  return <div className={styles.empty}>{children}</div>;
}
