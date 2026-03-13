<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Statement - {{ $period }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            margin: 40px 50px 60px 50px;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 10px;
            line-height: 1.5;
            color: #111827;
            background: #ffffff;
        }

        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 20px;
            border-bottom: 3px solid #8B5CF6;
            margin-bottom: 30px;
        }

        .logo-section {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon {
            width: 42px;
            height: 42px;
            background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-size: 20px;
        }

        .logo-text {
            font-size: 24px;
            font-weight: 800;
            background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -1px;
        }

        .header-title {
            text-align: right;
        }

        .header-title h1 {
            font-size: 22px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 4px;
            letter-spacing: -0.5px;
        }

        .header-title p {
            font-size: 11px;
            color: #6B7280;
        }

        /* Account Info */
        .account-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
        }

        .account-card {
            background: #F9FAFB;
            padding: 16px 20px;
            border-radius: 8px;
            border-left: 4px solid #8B5CF6;
        }

        .account-card h3 {
            font-size: 9px;
            text-transform: uppercase;
            color: #6B7280;
            margin-bottom: 6px;
            letter-spacing: 1px;
            font-weight: 600;
        }

        .account-card p {
            font-size: 14px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 2px;
        }

        .account-card .account-number {
            font-size: 11px;
            color: #6B7280;
            font-weight: 400;
        }

        .period-card {
            background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            text-align: right;
        }

        .period-card h3 {
            font-size: 9px;
            text-transform: uppercase;
            opacity: 0.8;
            margin-bottom: 4px;
            letter-spacing: 1px;
        }

        .period-card p {
            font-size: 18px;
            font-weight: 700;
        }

        .period-card .date-range {
            font-size: 10px;
            opacity: 0.8;
            margin-top: 4px;
        }

        /* Summary Grid */
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 30px;
        }

        .summary-item {
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #E5E7EB;
            text-align: center;
        }

        .summary-item.opening { background: #F9FAFB; }
        .summary-item.inward { background: #F0FDF4; }
        .summary-item.outward { background: #FEF2F2; }
        .summary-item.closing {
            background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
            color: white;
            border: none;
        }

        .summary-item h4 {
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }

        .summary-item.opening h4,
        .summary-item.inward h4,
        .summary-item.outward h4 {
            color: #6B7280;
        }

        .summary-item .amount {
            font-size: 18px;
            font-weight: 700;
        }

        .summary-item.opening .amount { color: #111827; }
        .summary-item.inward .amount { color: #059669; }
        .summary-item.outward .amount { color: #DC2626; }

        /* Transactions Table */
        .section-title {
            font-size: 12px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #E5E7EB;
        }

        .transactions-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .transactions-table thead {
            background: #F9FAFB;
        }

        .transactions-table th {
            padding: 10px 8px;
            text-align: left;
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6B7280;
            font-weight: 600;
            border-bottom: 2px solid #E5E7EB;
        }

        .transactions-table th:last-child,
        .transactions-table td:last-child {
            text-align: right;
        }

        .transactions-table tbody tr {
            border-bottom: 1px solid #F3F4F6;
        }

        .transactions-table tbody tr:hover {
            background: #F9FAFB;
        }

        .transactions-table td {
            padding: 10px 8px;
            font-size: 10px;
            color: #111827;
        }

        .transactions-table .date {
            color: #6B7280;
            white-space: nowrap;
            width: 80px;
        }

        .transactions-table .description {
            font-weight: 500;
        }

        .transactions-table .reference {
            color: #9CA3AF;
            font-family: 'Courier New', monospace;
            font-size: 9px;
        }

        .transactions-table .amount {
            font-weight: 600;
            font-family: 'Courier New', monospace;
            white-space: nowrap;
        }

        .transactions-table .amount.credit {
            color: #059669;
        }

        .transactions-table .amount.debit {
            color: #111827;
        }

        .transactions-table .balance {
            font-weight: 600;
            color: #111827;
            font-family: 'Courier New', monospace;
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #6B7280;
            border: 1px dashed #E5E7EB;
            border-radius: 8px;
            margin-bottom: 30px;
        }

        /* Footer */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .footer-left {
            font-size: 9px;
            color: #6B7280;
        }

        .footer-left .tagline {
            font-weight: 600;
            color: #8B5CF6;
            margin-bottom: 4px;
        }

        .footer-left .legal {
            margin-top: 8px;
        }

        .footer-right {
            text-align: right;
            font-size: 9px;
            color: #6B7280;
        }

        .page-number {
            font-weight: 600;
            color: #8B5CF6;
        }

        /* Utilities */
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: 700; }
        .text-green { color: #059669; }
        .text-red { color: #DC2626; }
        .text-purple { color: #8B5CF6; }

        /* Page break handling */
        .page-break {
            page-break-after: always;
        }

        tr.page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="logo-section">
            <div class="logo-icon">M</div>
            <span class="logo-text">Magnetiq</span>
        </div>
        <div class="header-title">
            <h1>Account Statement</h1>
            <p>Generated on {{ now()->format('F d, Y') }}</p>
        </div>
    </div>

    <!-- Account Info -->
    <div class="account-info">
        <div class="account-card">
            <h3>Account Information</h3>
            <p>{{ $account->name ?? 'Account' }}</p>
            <span class="account-number">
                @if($account->last4)
                    •••• {{ $account->last4 }}
                @else
                    Account ID: {{ $account->id ?? 'N/A' }}
                @endif
            </span>
        </div>
        <div class="period-card">
            <h3>Statement Period</h3>
            <p>{{ $period }}</p>
            <div class="date-range">{{ $startDate }} — {{ $endDate }}</div>
        </div>
    </div>

    <!-- Summary Grid -->
    <div class="summary-grid">
        <div class="summary-item opening">
            <h4>Opening Balance</h4>
            <div class="amount">${{ number_format($openingBalance, 2) }}</div>
        </div>
        <div class="summary-item inward">
            <h4>Total Inward</h4>
            <div class="amount">+${{ number_format($totalCredits, 2) }}</div>
        </div>
        <div class="summary-item outward">
            <h4>Total Outward</h4>
            <div class="amount">-${{ number_format($totalDebits, 2) }}</div>
        </div>
        <div class="summary-item closing">
            <h4>Closing Balance</h4>
            <div class="amount">${{ number_format($closingBalance, 2) }}</div>
        </div>
    </div>

    <!-- Transactions -->
    <h3 class="section-title">Transaction History</h3>

    @if($transactions->isEmpty())
        <div class="empty-state">
            <p>No transactions recorded during this period.</p>
        </div>
    @else
        <table class="transactions-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Reference</th>
                    <th>Amount</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $runningBalance = $openingBalance;
                @endphp
                
                @foreach($transactions as $transaction)
                    @php
                        $isCredit = $transaction->type === 'credit';
                        $amount = $isCredit ? $transaction->amount : -abs($transaction->amount);
                        if ($transaction->status === 'completed') {
                            $runningBalance += $amount;
                        }
                    @endphp
                    <tr>
                        <td class="date">
                            {{ \Carbon\Carbon::parse($transaction->date)->format('d M Y') }}
                        </td>
                        <td class="description">
                            {{ $transaction->description ?? 'Transaction' }}
                        </td>
                        <td class="reference">
                            {{ $transaction->transaction_number ?? $transaction->id }}
                        </td>
                        <td class="amount {{ $isCredit ? 'credit' : 'debit' }}">
                            {{ $isCredit ? '+' : '-' }}${{ number_format(abs($transaction->amount), 2) }}
                        </td>
                        <td class="balance">
                            ${{ number_format($runningBalance, 2) }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <!-- Footer -->
    <div class="footer">
        <div class="footer-left">
            <div class="tagline">Magnetiq Cooperation</div>
            <div class="legal">
                Regulated by the Financial Conduct Authority (FCA)<br>
                Magnetiq Financial Services Ltd, 123 Innovation Street, London EC2A 4DP, United Kingdom
            </div>
        </div>
        <div class="footer-right">
            <div>Page <span class="page-number">{{ $page ?? 1 }}</span> of <span class="page-number">{{ $totalPages ?? 1 }}</span></div>
            <div style="margin-top: 4px;">© {{ date('Y') }} Magnetiq. All rights reserved.</div>
        </div>
    </div>
</body>
</html>
