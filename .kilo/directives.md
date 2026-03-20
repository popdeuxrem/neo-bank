# Neo-Bank System Architecture & Constraints

## Core Ledger (Priority 1)
- **Constraint:** All transactions MUST use a double-entry accounting model.
- **Logic:** `Debit` and `Credit` entries must occur within a single database transaction. 
- **Validation:** Zero-sum check before committing.

## Frontend (React 19 + Inertia 2.0)
- **Standard:** Use Functional Components with TypeScript.
- **Inertia:** Prefer `useForm` for all submissions. Use `router.reload` for partial data updates.
- **Styling:** Tailwind CSS + shadcn/ui. Maintain the "Quantum/Cyberpunk" aesthetic.

## Fraud Detection Layer
- **Implementation:** Intercept `TransferController` requests. 
- **Checks:** Unusual velocity, Geo-IP mismatch (using Laravel Cloud headers), and blacklisted account status.

## Deployment
- **Target:** Laravel Cloud. 
- **Config:** Use `cloud.yaml`. Ensure `REDIS_CLIENT=valkey` and `DB_CONNECTION=pgsql`.
