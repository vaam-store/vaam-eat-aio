# NextJS v15

- Next.js + tRPC + ZenStack + Prisma – coding checklist
- Use Next.js app router with proper server/client component split; stream data with Suspense where helpful.
- Organise tRPC routers by domain inside @app/api folder; named exports only, no default exports.
- Derive React hooks (useQuery, useMutation, useInfiniteQuery) directly from tRPC procedure helpers—no extra wrappers.
- Keep all Prisma Client calls inside tRPC routers or server/\*\* utilities; never from client components.
- Enforce access control & field‑level rules through ZenStack ZModel; generate the guarded Prisma Client (@zenstackhq/runtime) and use it in place of raw Prisma.
- Maintain a single db instance per request via Next.js cookies().get() context helper to support multitenancy & row‑level security.
- Prefer schema‑driven types:• ZModel ➜ Prisma schema ➜ tRPC inferProcedureOutput ➜ component props.No manual type duplication.
- Transactions: wrap multi‑step mutations in prisma.$transaction([...]); surface single RPC endpoint to the UI.
- Use optimistic UI via tRPC mutation options (onMutate, onError, onSettled) and Immer or Zustand for temporary cache updates.
- Paginate lists with cursor‑based queries (cursor, take) and useInfiniteQuery; expose nextCursor in tRPC output.
- Cache control:• revalidatePath() on server actions.• tRPC ssg helpers for static paths when possible.• redis or upstash for expensive reads.
- Testing:• Unit‑test routers with vitest + in‑memory SQLite.• Component tests with @testing-library/react; stub tRPC hooks via MSW.
- Database migrations via prisma migrate only; keep generated SQL under version control.
- Stick to functional components, TypeScript strict mode, AirBnB/biome lint rules, and kebab‑case file paths.
- No README or setup instructions unless explicitly requested—focus on writing code and components.
- Always use the error handler showErrorToast from the src/service/error-handler.ts.
