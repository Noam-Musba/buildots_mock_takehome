export type IssueStatus = 'open' | 'in_progress' | 'resolved';
export type IssueSeverity = 'low' | 'medium' | 'high';

export interface Issue {
  id: string;
  title: string;
  description: string;
  assignee: string;
  floor: string;
  status: IssueStatus;
  severity: IssueSeverity;
  createdAt: string;
  updatedAt: string;
}

export type IssueSort = 'newest' | 'oldest' | 'severity';

export interface IssueQuery {
  status?: IssueStatus | 'all';
  search?: string;
  sort?: IssueSort;
}

export interface IssueListResult {
  items: Issue[];
  total: number;
}
