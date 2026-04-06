# Finance Data Processing and Access Control Backend

This is my submission for the Backend Developer Intern assignment.
I focused on clean backend design, role-based access control, financial record processing, and dashboard summaries.
The goal was to keep the implementation correct and maintainable without adding unnecessary complexity.

## Submission Links
- GitHub Repository: https://github.com/bansalKrishna311/zorvyn-assesment
- Hosted Assignment (Live): https://zorvyn-assesment-krishna.vercel.app/
- Live Backend API: https://zorvyn-assesment-phi.vercel.app

This assignment is already deployed and can be reviewed directly from the live link above.

## What I Built and Why?
| What I implemented | Why I did it |
|---|---|
| Modular backend layers (app, routes, controllers, models, middlewares, config) | Keeps logic separated and maintainable |
| User and Record data models in MongoDB/Mongoose | Direct mapping to assignment entities with built-in schema validation |
| JWT authentication + role-based middleware | Enforces backend-level access control for each endpoint |
| User, record, and dashboard endpoints | Covers required user management, CRUD, and analytics use cases |
| Request validation + standard HTTP error codes | Prevents bad input and gives predictable API behavior |

## Requirement Coverage
| Assignment Requirement | How I Implemented It | Why This Choice |
|---|---|---|
| User and role management | User model + admin user APIs + role enum + isActive flag | Simple and explicit RBAC foundation |
| Financial records CRUD | Create, read, update, delete record APIs | Covers complete record lifecycle |
| Filtering and pagination | Query filters (type/category/date range) + page/limit | Practical for dashboard-style listing |
| Dashboard summary APIs | Aggregation pipeline for totals, categories, monthly trend + recent activity | Efficient summary generation in DB |
| Access control logic | auth middleware (JWT + active check) + allowRoles middleware | Clear, reusable authorization policy |
| Validation and reliability | express-validator for auth/user/record payloads + status codes (400/401/403/404/409/500) | Safer input handling and useful errors |
| Data persistence | MongoDB Atlas with Mongoose schemas | Fast to build, flexible for finance records |

## API Access Snapshot
| Endpoint Group | Routes | Access |
|---|---|---|
| Auth | /api/auth/register, /api/auth/login | Public |
| Users | /api/users, /api/users/:id | Admin |
| Profile | /api/users/me | Any authenticated user |
| Records | /api/records (POST/PATCH/DELETE) | Admin |
| Records List | /api/records (GET) | Admin, Analyst |
| Dashboard | /api/dashboard/summary | Admin, Analyst, Viewer |

## Assumptions and Trade-offs
- Used a single finance records collection and global summary aggregation.
- Kept hard delete for records to keep logic simple for this assignment.
- Used JWT access token flow without refresh tokens to keep scope focused.
- Prioritized backend correctness and clarity over advanced production features.

## Project Structure
```text
backend/   Express API (assignment core)
frontend/  React docs and API playground for evaluation
```

## Contact
- Email: bansalkrishna311@gmail.com
- Phone: +91 9511 834002
- LinkedIn: https://linkedin.com/in/bansalkrishna311
