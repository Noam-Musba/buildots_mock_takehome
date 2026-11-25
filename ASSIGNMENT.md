# Take-home assignment — Issue triage workflow

You are joining an existing frontend codebase used by construction teams to review site observations.

The application already loads observations and supports filtering by status.

Your task is to extend the existing experience without rewriting the application.

## Timebox

Please spend **up to 3 hours** on the assignment.

We care more about sound engineering decisions, readable code, and a working core flow than about completing every optional detail.

## Required changes

### 1. Search and sorting

Add:

- A text search input.
- Search should match issue title or assignee.
- Search requests should be debounced so typing does not trigger a request for every keystroke.
- A sort control with:
  - Newest first
  - Oldest first
  - Severity

Search, status filter, and sorting should work together.

The provided API already supports these query fields.

### 2. Issue details panel

When the user chooses an issue from the table:

- Open a right-side detail panel.
- Fetch the latest details for that issue by ID.
- Show at least:
  - Title
  - ID
  - Description
  - Assignee
  - Floor
  - Severity
  - Status
- Handle loading and failure inside the panel without breaking the list.

### 3. Status update

From the detail panel:

- Allow an open/in-progress issue to be marked as resolved.
- Allow a resolved issue to be reopened as open.
- After a successful update, both the detail panel and the issue list must show consistent status.
- Show a sensible failure state if the update fails.

You may choose whether to refetch or update local/cache state, but be prepared to explain the tradeoff.

### 4. Tests

Add meaningful automated tests for the new behavior.

You do not need exhaustive coverage. Prioritize the behavior that gives you the most confidence in the feature.

## Constraints

- Use the existing React + TypeScript stack.
- Keep the existing CSS Modules approach.
- Do not replace the mocked API with a real backend.
- Avoid adding dependencies unless they clearly improve the solution.
- Do not perform unrelated refactors.
- Existing behavior should continue to work.

## What we will discuss afterward

Be prepared to explain:

- How you explored the existing codebase.
- Why you placed state where you did.
- How you handled stale or overlapping requests.
- How you kept the list and detail panel consistent after a mutation.
- What you chose to test and why.
- What you would improve with more time.

## Optional improvements

Only attempt these if the required flow is complete and stable:

- Persist search/filter/sort state in the URL.
- Improve keyboard/focus behavior for the detail panel.
- Add a small cache or request-deduplication layer.
- Add an explicit empty state for combined search/filter results.
