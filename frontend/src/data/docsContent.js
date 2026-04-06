export const docsSidebarGroups = [
  {
    label: 'Core',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'authentication', label: 'Authentication' },
      { id: 'role-system', label: 'Role System' },
      { id: 'api-index', label: 'API Index' },
    ],
  },
  {
    label: 'Endpoint Specs',
    items: [
      { id: 'reference-auth', label: 'Auth' },
      { id: 'reference-users', label: 'Users' },
      { id: 'reference-records', label: 'Records' },
      { id: 'reference-dashboard', label: 'Dashboard' },
    ],
  },
  {
    label: 'Support',
    items: [
      { id: 'error-reference', label: 'Error Reference' },
      { id: 'quick-start', label: 'Quick Start' },
    ],
  },
];

export const docsErrorRows = [
  {
    code: 400,
    meaning: 'Bad Request',
    when: 'Validation failed (express-validator) or malformed ObjectId parameters',
  },
  {
    code: 401,
    meaning: 'Unauthorized',
    when: 'Missing token, invalid token, or invalid login credentials',
  },
  {
    code: 403,
    meaning: 'Forbidden',
    when: 'Role restriction denied access or user account is inactive',
  },
  {
    code: 404,
    meaning: 'Not Found',
    when: 'Unknown route, user not found, or record not found',
  },
  {
    code: 409,
    meaning: 'Conflict',
    when: 'Email already registered during register/create-user flows',
  },
  {
    code: 500,
    meaning: 'Server Error',
    when: 'Unhandled controller/database failure',
  },
];

export function getQuickStartCommands(baseUrl) {
  return [
    {
      title: '1. Register a user',
      code: `curl -X POST ${baseUrl}/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name":"string","email":"string","password":"string","role":"viewer"}'`,
    },
    {
      title: '2. Login and receive JWT',
      code: `curl -X POST ${baseUrl}/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"string","password":"string"}'`,
    },
    {
      title: '3. Call an authenticated endpoint',
      code: `curl -X GET ${baseUrl}/api/dashboard/summary \\
  -H "Authorization: Bearer JWT_TOKEN"`,
    },
    {
      title: '4. Create a record (admin role)',
      code: `curl -X POST ${baseUrl}/api/records \\
  -H "Authorization: Bearer JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"amount":123.45,"type":"income","category":"string","date":"2026-04-05","notes":"string"}'`,
    },
  ];
}

export function sectionIdForGroup(group) {
  return `reference-${group.toLowerCase()}`;
}
