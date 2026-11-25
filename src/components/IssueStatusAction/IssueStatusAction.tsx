import { useIssueStatusUpdate } from '../../hooks/useIssueStatusUpdate';
import type { Issue, IssueStatus } from '../../types/issue';
import styles from './IssueStatusAction.module.css';

interface IssueStatusActionProps {
  issue: Issue;
  onUpdated: (issue: Issue) => void;
}

interface StatusAction {
  label: string;
  status: IssueStatus;
  variant: 'primary' | 'secondary';
}

const actionsByStatus: Record<IssueStatus, StatusAction[]> = {
  open: [
    {
      label: 'Mark as in progress',
      status: 'in_progress',
      variant: 'secondary',
    },
    {
      label: 'Mark as resolved',
      status: 'resolved',
      variant: 'primary',
    },
  ],
  in_progress: [
    {
      label: 'Mark as resolved',
      status: 'resolved',
      variant: 'primary',
    },
  ],
  resolved: [
    {
      label: 'Reopen issue',
      status: 'open',
      variant: 'primary',
    },
  ],
};

export function IssueStatusAction({
  issue,
  onUpdated,
}: IssueStatusActionProps) {
  const { error, updatingTo, updateStatus } = useIssueStatusUpdate(
    issue.id,
    onUpdated,
  );
  const actions = actionsByStatus[issue.status];

  return (
    <div className={styles.action}>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <div className={styles.buttons}>
        {actions.map((action) => (
          <button
            key={action.status}
            type="button"
            className={`${styles.button} ${styles[action.variant]}`}
            onClick={() => updateStatus(action.status)}
            disabled={updatingTo !== null}
          >
            {updatingTo === action.status ? 'Updating status...' : action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
