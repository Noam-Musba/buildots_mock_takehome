import type { Issue } from '../types/issue';

export const seedIssues: Issue[] = [
  {
    id: 'OBS-1042',
    title: 'Missing firestop around cable tray',
    description:
      'Cable tray penetration through the corridor wall is missing approved firestop material.',
    assignee: 'Dana Levi',
    floor: 'Level 8',
    status: 'open',
    severity: 'high',
    createdAt: '2026-11-20T08:30:00.000Z',
    updatedAt: '2026-11-20T08:30:00.000Z',
  },
  {
    id: 'OBS-1039',
    title: 'Ceiling grid alignment',
    description:
      'Ceiling grid is visibly misaligned near meeting room 8B and should be checked before closing.',
    assignee: 'Omer Cohen',
    floor: 'Level 8',
    status: 'in_progress',
    severity: 'medium',
    createdAt: '2026-11-19T10:10:00.000Z',
    updatedAt: '2026-11-21T09:20:00.000Z',
  },
  {
    id: 'OBS-1031',
    title: 'Paint finish damaged near elevator',
    description:
      'Fresh paint has been scratched next to the east elevator lobby.',
    assignee: 'Maya Azulay',
    floor: 'Level 5',
    status: 'resolved',
    severity: 'low',
    createdAt: '2026-11-17T12:45:00.000Z',
    updatedAt: '2026-11-18T13:00:00.000Z',
  },
  {
    id: 'OBS-1028',
    title: 'Incorrect door hardware installed',
    description:
      'Door 7-14 has a different handle set than specified in the approved drawings.',
    assignee: 'Dana Levi',
    floor: 'Level 7',
    status: 'open',
    severity: 'medium',
    createdAt: '2026-11-16T07:50:00.000Z',
    updatedAt: '2026-11-16T07:50:00.000Z',
  },
  {
    id: 'OBS-1024',
    title: 'Water pooling near temporary drain',
    description:
      'Water remains on the slab after cleaning and is not reaching the temporary drain.',
    assignee: 'Avi Bar',
    floor: 'Level 3',
    status: 'open',
    severity: 'high',
    createdAt: '2026-11-15T15:25:00.000Z',
    updatedAt: '2026-11-18T08:15:00.000Z',
  },
  {
    id: 'OBS-1018',
    title: 'Outlet cover missing',
    description:
      'Electrical outlet outside room 504 is missing its final cover plate.',
    assignee: 'Maya Azulay',
    floor: 'Level 5',
    status: 'in_progress',
    severity: 'low',
    createdAt: '2026-11-13T11:40:00.000Z',
    updatedAt: '2026-11-20T16:10:00.000Z',
  },
  {
    id: 'OBS-1012',
    title: 'Duct insulation incomplete',
    description:
      'Insulation is incomplete on the supply duct above the north corridor.',
    assignee: 'Omer Cohen',
    floor: 'Level 6',
    status: 'resolved',
    severity: 'medium',
    createdAt: '2026-11-11T09:00:00.000Z',
    updatedAt: '2026-11-14T10:30:00.000Z',
  },
  {
    id: 'OBS-1007',
    title: 'Guardrail base plate loose',
    description:
      'One temporary guardrail base plate moves under hand pressure and requires tightening.',
    assignee: 'Avi Bar',
    floor: 'Level 9',
    status: 'open',
    severity: 'high',
    createdAt: '2026-11-09T06:35:00.000Z',
    updatedAt: '2026-11-09T06:35:00.000Z',
  },
];
