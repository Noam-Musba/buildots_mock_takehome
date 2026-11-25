import { useState } from 'react';
import styles from './App.module.css';
import { EmptyState } from './components/EmptyState/EmptyState';
import { ErrorState } from './components/ErrorState/ErrorState';
import { IssueTable } from './components/IssueTable/IssueTable';
import { PageShell } from './components/PageShell/PageShell';
import { Spinner } from './components/Spinner/Spinner';
import { useIssues } from './hooks/useIssues';
import type { IssueStatus } from './types/issue';

export function App() {
  const [status, setStatus] = useState<IssueStatus | 'all'>('all');
  const { issues, loading, error, reload } = useIssues(status);

  return (
    <PageShell
      title="Site observations"
      subtitle="Review and triage open observations from active construction sites."
      actions={
        <button type="button" className={styles.refreshButton} onClick={reload}>
          Refresh
        </button>
      }
    >
      <section className={styles.card}>
        <div className={styles.toolbar}>
          <label>
            <span>Status</span>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as IssueStatus | 'all')
              }
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </label>

          {!loading && !error ? (
            <span className={styles.count}>
              {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
            </span>
          ) : null}
        </div>

        <div className={styles.content}>
          {loading ? <Spinner label="Loading observations..." /> : null}

          {!loading && error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : null}

          {!loading && !error && issues.length === 0 ? (
            <EmptyState>No observations match this status.</EmptyState>
          ) : null}

          {!loading && !error && issues.length > 0 ? (
            <IssueTable issues={issues} />
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
