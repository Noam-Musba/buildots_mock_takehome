import { useEffect, useState } from 'react';
import { getIssue } from '../../api/issuesApi';
import type { Issue } from '../../types/issue';
import { ErrorState } from '../ErrorState/ErrorState';
import { SidePanel } from '../SidePanel/SidePanel';
import { Spinner } from '../Spinner/Spinner';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import styles from './IssueDetailsPanel.module.css';

interface IssueDetailsPanelProps {
  issueId: string | null;
  onClose: () => void;
}

export function IssueDetailsPanel({
  issueId,
  onClose,
}: IssueDetailsPanelProps) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    if (!issueId) {
      setIssue(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    setIssue(null);
    setLoading(true);
    setError(null);

    getIssue(issueId, controller.signal)
      .then((result) => {
        setIssue(result);
        setLoading(false);
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === 'AbortError'
        ) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Could not load issue details',
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [issueId, reloadVersion]);

  return (
    <SidePanel open={issueId !== null} title="Issue details" onClose={onClose}>
      {loading ? <Spinner label="Loading issue details..." /> : null}

      {!loading && error ? (
        <ErrorState
          message={error}
          onRetry={() => setReloadVersion((version) => version + 1)}
        />
      ) : null}

      {!loading && !error && issue ? (
        <article className={styles.details}>
          <div className={styles.heading}>
            <p className={styles.issueId}>{issue.id}</p>
            <h3>{issue.title}</h3>
          </div>

          <p className={styles.description}>{issue.description}</p>

          <dl className={styles.metadata}>
            <div>
              <dt>Assignee</dt>
              <dd>{issue.assignee}</dd>
            </div>
            <div>
              <dt>Floor</dt>
              <dd>{issue.floor}</dd>
            </div>
            <div>
              <dt>Severity</dt>
              <dd className={styles.capitalize}>{issue.severity}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={issue.status} />
              </dd>
            </div>
          </dl>
        </article>
      ) : null}
    </SidePanel>
  );
}
