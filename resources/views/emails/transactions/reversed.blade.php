<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Reversed - Magnetiq</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #374151;
            background: #f9fafb;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .email-wrapper {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
            padding: 40px 30px;
            text-align: center;
        }
        
        .logo {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .logo-icon {
            width: 48px;
            height: 48px;
            background: white;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #8B5CF6;
            font-weight: bold;
            font-size: 24px;
        }
        
        .logo-text {
            font-size: 28px;
            font-weight: 700;
            color: white;
            letter-spacing: -0.5px;
        }
        
        .subject {
            font-size: 22px;
            font-weight: 600;
            color: white;
            margin-top: 10px;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .icon {
            width: 80px;
            height: 80px;
            background: #fef3c7;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 25px;
        }
        
        .icon svg {
            width: 40px;
            height: 40px;
            color: #f59e0b;
        }
        
        .title {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .message {
            font-size: 16px;
            color: #374151;
            margin-bottom: 25px;
            line-height: 1.7;
            text-align: center;
        }
        
        .details {
            background: #f3f4f6;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e5e5;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-size: 14px;
            color: #6b7280;
        }
        
        .detail-value {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
        }
        
        .amount {
            font-size: 20px;
            font-weight: 700;
            color: #dc2626;
        }
        
        .reason {
            background: #fef3c7;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .reason p {
            font-size: 14px;
            color: #92400e;
            margin: 0;
        }
        
        .reason strong {
            display: block;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        
        .footer {
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e5e5e5;
        }
        
        .footer p {
            font-size: 13px;
            color: #9ca3af;
            margin: 0;
        }
        
        @media print {
            body { -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-wrapper">
            <div class="header">
                <div class="logo">
                    <div class="logo-icon">M</div>
                    <span class="logo-text">Magnetiq</span>
                </div>
                <p class="subject">Transaction Reversed</p>
            </div>
            
            <div class="content">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                </div>
                
                <h1 class="title">Administrative Correction</h1>
                
                <p class="message">
                    A transaction on your account has been reversed. The amount has been credited back to your account.
                </p>
                
                <div class="details">
                    <div class="detail-row">
                        <span class="detail-label">Transaction ID</span>
                        <span class="detail-value">{{ $transaction->transaction_number }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Reversed Amount</span>
                        <span class="detail-value amount">{{ $amount }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Original Date</span>
                        <span class="detail-value">{{ $transaction->created_at->format('M d, Y') }}</span>
                    </div>
                </div>
                
                <div class="reason">
                    <p>
                        <strong>Reason</strong>
                        {{ $reason }}
                    </p>
                </div>
                
                <p class="message">
                    If you have any questions about this reversal, please contact our support team.
                </p>
            </div>
            
            <div class="footer">
                <p>&copy; {{ date('Y') }} Magnetiq. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>