import { useState } from 'react';
import styles from './App.module.css';
import { EmptyState } from './components/EmptyState/EmptyState';
import { ErrorState } from './components/ErrorState/ErrorState';
import { IssueFilters } from './components/IssueFilters/IssueFilters';
import { IssueTable } from './components/IssueTable/IssueTable';
import { PageShell } from './components/PageShell/PageShell';
import { Spinner } from './components/Spinner/Spinner';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { useIssues } from './hooks/useIssues';
import type { IssueSort, IssueStatus } from './types/issue';

export function App() {
  const [status, setStatus] = useState<IssueStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<IssueSort>('newest');
  const debouncedSearch = useDebouncedValue(search, 300);
  const { issues, loading, error, reload } = useIssues({
    search: debouncedSearch,
    sort,
    status,
  });

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
          <IssueFilters
            search={search}
            sort={sort}
            status={status}
            onSearchChange={setSearch}
            onSortChange={setSort}
            onStatusChange={setStatus}
          />

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
            <EmptyState>No observations match these filters.</EmptyState>
          ) : null}

          {!loading && !error && issues.length > 0 ? (
            <IssueTable issues={issues} />
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
