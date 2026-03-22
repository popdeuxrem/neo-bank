# FinCore / Magnetiq: Enterprise Banking Specification
**Stack:** Laravel 11, React 19, Inertia 2.0, Tailwind CSS, shadcn/ui.
**Architecture:** Modular Domain-Driven Design.
**Global UI Constraint:** All navigation submenus MUST be implemented as accessible dropdowns (Radix UI / shadcn Accordion or DropdownMenu). Fully responsive (Mobile-first), Dark/Light mode toggle required.

## Phase 1: Identity & Access Management (IAM)
- **User Types:** Customer, Staff, Admin.
- **Features:** KYC Management, 2FA Verification, Passcode Management, Login as User (Impersonation), Role & Permission Settings, Inactive User Settings.
- **UI:** User Ranks/Portfolio Badges dynamically rendered.

## Phase 2: Core Banking & Ledger Engine
- **Accounts:** Main Wallet, Portfolio Earnings Wallet. Balance Add/Subtract operations via atomic double-entry ledger.
- **Transfers:** Internal Fund Transfer, Wire and Swift Transfer.
- **Products:** Bank DPS (Deposit Pension Scheme), Bank FDR (Fixed Deposit Receipt) with FDR Compounding logic, Bank Loan origination, Bill Payments.
- **Financials:** Bank and User Profits calculation.

## Phase 3: Gateway & Payment Operations
- **Processing:** Automatic & Manual Deposit, Automatic & Manual Withdraw.
- **Currencies:** Multi-currency support (Crypto and Fiat).
- **Gateways:** Implement modular gateway interfaces (Stripe, Crypto Wallets, Custom Manual). **STRICT CONSTRAINT: Never implement, reference, or include Paystack.**

## Phase 4: Marketing & Loyalty
- **Referrals:** Multi-Level Referrals, Referral Bonus distribution.
- **Rewards:** Reward Points system, User Paybacks, Signup Bonus triggers.

## Phase 5: Support & Communications
- **Channels:** Support Ticket system, Tawk Chat integration, Messenger webhook integration.
- **Notifications:** User & Admin Notifications (with UI tone/sound alerts), SMS Settings, Email Newsletter module.

## Phase 6: CMS & System Administration
- **Frontend:** Landing Page Management, Dynamic Landing Theme, Pages Management, Home page redirection, Site Navigation, Site Footer.
- **SEO & Tracking:** Pages SEO, SEO Meta Settings, Google Analytics, Google reCaptcha.
- **System Ops:** Admin URL changeable, Theme Management, Site Maintenance Mode, GDPR Settings, Language translatable, Custom CSS injection, Clear Caches, System Details dashboard.
