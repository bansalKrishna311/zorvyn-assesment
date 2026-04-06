export const roles = [
  {
    key: 'admin',
    label: 'ADMIN',
    color: 'red',
    description: 'Full system access including user and record administration.',
  },
  {
    key: 'analyst',
    label: 'ANALYST',
    color: 'blue',
    description: 'Can analyze records and dashboard summaries without write access.',
  },
  {
    key: 'viewer',
    label: 'VIEWER',
    color: 'green',
    description: 'Read-only visibility for personal profile and dashboard summary.',
  },
];

export const roleMatrix = [
  {
    feature: 'Access /api/users/me',
    admin: true,
    analyst: true,
    viewer: true,
  },
  {
    feature: 'Create user accounts',
    admin: true,
    analyst: false,
    viewer: false,
  },
  {
    feature: 'List and filter users',
    admin: true,
    analyst: false,
    viewer: false,
  },
  {
    feature: 'Update users',
    admin: true,
    analyst: false,
    viewer: false,
  },
  {
    feature: 'Create records',
    admin: true,
    analyst: false,
    viewer: false,
  },
  {
    feature: 'Read records',
    admin: true,
    analyst: true,
    viewer: false,
  },
  {
    feature: 'Update and delete records',
    admin: true,
    analyst: false,
    viewer: false,
  },
  {
    feature: 'View dashboard summary',
    admin: true,
    analyst: true,
    viewer: true,
  },
];
