import type { IssueStatus } from '../../types/issue';
import styles from './StatusBadge.module.css';

const labels: Record<IssueStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
};

export function StatusBadge({ status }: { status: IssueStatus }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>{labels[status]}</span>
  );
}
