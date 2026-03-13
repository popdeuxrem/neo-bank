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
        
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #1a1a1a;
            background: #fff;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
            border-bottom: 3px solid #8B5CF6;
            margin-bottom: 30px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
        }
        
        .logo-text {
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
        }
        
        .statement-title {
            text-align: right;
        }
        
        .statement-title h1 {
            font-size: 20px;
            color: #1a1a1a;
            margin-bottom: 4px;
        }
        
        .statement-title p {
            color: #666;
            font-size: 11px;
        }
        
        .account-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        
        .account-details {
            background: #f8f9fa;
            padding: 15px 20px;
            border-radius: 8px;
            flex: 1;
            margin-right: 20px;
        }
        
        .account-details h3 {
            font-size: 11px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        
        .account-details p {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .account-details span {
            font-size: 12px;
            color: #666;
        }
        
        .period-info {
            background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            text-align: right;
        }
        
        .period-info h3 {
            font-size: 11px;
            text-transform: uppercase;
            opacity: 0.8;
            margin-bottom: 4px;
        }
        
        .period-info p {
            font-size: 18px;
            font-weight: 700;
        }
        
        .summary-cards {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .summary-card {
            flex: 1;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e5e5;
        }
        
        .summary-card h4 {
            font-size: 10px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        
        .summary-card .amount {
            font-size: 20px;
            font-weight: 700;
        }
        
        .summary-card.opening .amount { color: #1a1a1a; }
        .summary-card.closing .amount { color: #8B5CF6; }
        .summary-card.credits .amount { color: #10b981; }
        .summary-card.debits .amount { color: #ef4444; }
        
        .transactions-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        .transactions-table th {
            background: #f8f9fa;
            padding: 12px 10px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            color: #666;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e5e5e5;
        }
        
        .transactions-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 12px;
        }
        
        .transactions-table tr:last-child td {
            border-bottom: none;
        }
        
        .transactions-table .date {
            color: #666;
            white-space: nowrap;
        }
        
        .transactions-table .description {
            font-weight: 500;
        }
        
        .transactions-table .amount {
            text-align: right;
            font-weight: 600;
            font-family: 'Courier New', monospace;
        }
        
        .transactions-table .amount.credit {
            color: #10b981;
        }
        
        .transactions-table .amount.debit {
            color: #ef4444;
        }
        
        .transactions-table .status {
            text-align: center;
        }
        
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 9px;
            text-transform: uppercase;
            font-weight: 600;
        }
        
        .status-badge.completed {
            background: #d1fae5;
            color: #065f46;
        }
        
        .status-badge.pending {
            background: #fef3c7;
            color: #92400e;
        }
        
        .status-badge.failed {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            color: #666;
            font-size: 10px;
        }
        
        .footer p {
            margin-bottom: 4px;
        }
        
        @media print {
            body { -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <div class="logo-icon">M</div>
                <span class="logo-text">Magnetiq</span>
            </div>
            <div class="statement-title">
                <h1>Account Statement</h1>
                <p>Generated on {{ now()->format('F d, Y') }}</p>
            </div>
        </div>
        
        <!-- Account Info -->
        <div class="account-info">
            <div class="account-details">
                <h3>Account Information</h3>
                <p>{{ $account->name }}</p>
                <span>{{ ucfirst($account->type) }} Account</span>
                @if($account->last4)
                    <br><span>****{{ $account->last4 }}</span>
                @endif
            </div>
            <div class="period-info">
                <h3>Statement Period</h3>
                <p>{{ $startDate }} - {{ $endDate }}</p>
            </div>
        </div>
        
        <!-- Summary Cards -->
        <div class="summary-cards">
            <div class="summary-card opening">
                <h4>Opening Balance</h4>
                <div class="amount">${{ number_format($openingBalance, 2) }}</div>
            </div>
            <div class="summary-card credits">
                <h4>Total Credits</h4>
                <div class="amount">+${{ number_format($totalCredits, 2) }}</div>
            </div>
            <div class="summary-card debits">
                <h4>Total Debits</h4>
                <div class="amount">-${{ number_format($totalDebits, 2) }}</div>
            </div>
            <div class="summary-card closing">
                <h4>Closing Balance</h4>
                <div class="amount">${{ number_format($closingBalance, 2) }}</div>
            </div>
        </div>
        
        <!-- Transactions Table -->
        <h3 style="margin-bottom: 15px; font-size: 14px; color: #1a1a1a;">Transaction History</h3>
        
        @if($transactions->isEmpty())
            <div class="empty-state">
                <p>No transactions during this period.</p>
            </div>
        @else
            <table class="transactions-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th style="text-align: right;">Amount</th>
                        <th style="text-align: center;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($transactions as $transaction)
                        <tr>
                            <td class="date">{{ \Carbon\Carbon::parse($transaction->date)->format('M d, Y') }}</td>
                            <td class="description">{{ $transaction->description }}</td>
                            <td>{{ $transaction->category ?? '-' }}</td>
                            <td class="amount {{ $transaction->type === 'credit' ? 'credit' : 'debit' }}">
                                {{ $transaction->type === 'credit' ? '+' : '-' }}${{ number_format(abs($transaction->amount), 2) }}
                            </td>
                            <td class="status">
                                <span class="status-badge {{ $transaction->status }}">
                                    {{ $transaction->status }}
                                </span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
        
        <!-- Footer -->
        <div class="footer">
            <p>This statement was automatically generated by Magnetiq.</p>
            <p>Please contact support@magnetiq.com if you notice any discrepancies.</p>
            <p>&copy; {{ date('Y') }} Magnetiq. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
