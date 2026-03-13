<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KYC Not Verified - Magnetiq</title>
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
            background: linear-gradient(135deg, #6B7280 0%, #4B5563 100%);
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
            color: #6B7280;
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
            text-align: center;
        }
        
        .icon {
            width: 80px;
            height: 80px;
            background: #fee2e2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 25px;
        }
        
        .icon svg {
            width: 40px;
            height: 40px;
            color: #ef4444;
        }
        
        .title {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 15px;
        }
        
        .message {
            font-size: 16px;
            color: #374151;
            margin-bottom: 20px;
            line-height: 1.7;
        }
        
        .reason-box {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: left;
        }
        
        .reason-box p {
            font-size: 14px;
            color: #991b1b;
            margin: 0;
        }
        
        .reason-box strong {
            display: block;
            margin-bottom: 5px;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .button-wrapper {
            margin-top: 30px;
        }
        
        @component('emails.components.button', ['url' => $verifyUrl, 'color' => '#8B5CF6'])
            Try Again
        @endcomponent
        
        .help-text {
            margin-top: 25px;
            font-size: 14px;
            color: #6b7280;
        }
        
        .help-text a {
            color: #8B5CF6;
            text-decoration: none;
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
                <p class="subject">Identity Verification Not Approved</p>
            </div>
            
            <div class="content">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                
                <h1 class="title">Verification Not Approved</h1>
                
                <p class="message">
                    We're sorry, but we couldn't verify your identity documents at this time. 
                    Your account remains active with standard limits.
                </p>
                
                <div class="reason-box">
                    <strong>Reason</strong>
                    <p>{{ $reason }}</p>
                </div>
                
                <div class="button-wrapper">
                    @component('emails.components.button', ['url' => $verifyUrl, 'color' => '#8B5CF6'])
                        Try Again
                    @endcomponent
                </div>
                
                <p class="help-text">
                    Need help? Contact our support team at <a href="mailto:support@magnetiq.com">support@magnetiq.com</a>
                </p>
            </div>
            
            <div class="footer">
                <p>&copy; {{ date('Y') }} Magnetiq. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
