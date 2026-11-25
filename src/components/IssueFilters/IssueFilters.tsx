import type { IssueSort, IssueStatus } from '../../types/issue';
import styles from './IssueFilters.module.css';

interface IssueFiltersProps {
  search: string;
  sort: IssueSort;
  status: IssueStatus | 'all';
  onSearchChange: (search: string) => void;
  onSortChange: (sort: IssueSort) => void;
  onStatusChange: (status: IssueStatus | 'all') => void;
}

export function IssueFilters({
  search,
  sort,
  status,
  onSearchChange,
  onSortChange,
  onStatusChange,
}: IssueFiltersProps) {
  return (
    <div className={styles.filters}>
      <label>
        <span>Search</span>
        <input
          type="search"
          value={search}
          placeholder="Title or assignee"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label>
        <span>Status</span>
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as IssueStatus | 'all')
          }
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </label>

      <label>
        <span>Sort</span>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as IssueSort)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="severity">Severity</option>
        </select>
      </label>
    </div>
  );
}
