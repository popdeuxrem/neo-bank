# Neo-Bank Engineering Standards
- **Database:** PostgreSQL. All ledger transactions MUST be atomic (DB Transactions).
- **Architecture:** Double-entry accounting. Credit/Debit must balance.
- **Frontend:** React 19 + Inertia 2.0. Use Functional Components with TypeScript interfaces.
- **Security:** Sanitize all PII in logs. Implement Fraud Detection Layer checks on every Transfer flow.
- **Deployment:** Targets Laravel Cloud. Use `cloud.yaml` for environment-specific configs.

