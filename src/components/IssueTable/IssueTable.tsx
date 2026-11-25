import type { Issue } from '../../types/issue';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import styles from './IssueTable.module.css';

interface IssueTableProps {
  issues: Issue[];
  onSelectIssue?: (issueId: string) => void;
}

export function IssueTable({ issues, onSelectIssue }: IssueTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Issue</th>
            <th>Floor</th>
            <th>Assignee</th>
            <th>Severity</th>
            <th>Status</th>
            <th>
              <span className={styles.visuallyHidden}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td>
                <div className={styles.issueTitle}>{issue.title}</div>
                <div className={styles.issueId}>{issue.id}</div>
              </td>
              <td>{issue.floor}</td>
              <td>{issue.assignee}</td>
              <td className={styles.capitalize}>{issue.severity}</td>
              <td>
                <StatusBadge status={issue.status} />
              </td>
              <td>
                <button
                  type="button"
                  className={styles.viewButton}
                  onClick={() => onSelectIssue?.(issue.id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
