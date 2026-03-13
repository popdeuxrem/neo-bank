<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KYC Approved - Magnetiq</title>
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
            text-align: center;
        }
        
        .icon {
            width: 80px;
            height: 80px;
            background: #d1fae5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 25px;
        }
        
        .icon svg {
            width: 40px;
            height: 40px;
            color: #10b981;
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
            margin-bottom: 25px;
            line-height: 1.7;
        }
        
        .highlight {
            background: #f3f4f6;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .highlight p {
            font-size: 15px;
            color: #374151;
            margin: 0;
        }
        
        .highlight strong {
            color: #8B5CF6;
        }
        
        .button-wrapper {
            margin-top: 30px;
        }
        
        @component('emails.components.button', ['url' => $dashboardUrl, 'color' => '#8B5CF6'])
            Go to Dashboard
        @endcomponent
        
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
                <p class="subject">Identity Verification Approved</p>
            </div>
            
            <div class="content">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <h1 class="title">Congratulations!</h1>
                
                <p class="message">
                    Your identity has been successfully verified. Your account is now fully activated and ready to use.
                </p>
                
                <div class="highlight">
                    <p>
                        <strong>Your account limits have been increased.</strong><br>
                        You now have access to higher transaction limits and all premium features.
                    </p>
                </div>
                
                <div class="button-wrapper">
                    @component('emails.components.button', ['url' => $dashboardUrl, 'color' => '#8B5CF6'])
                        Go to Dashboard
                    @endcomponent
                </div>
            </div>
            
            <div class="footer">
                <p>&copy; {{ date('Y') }} Magnetiq. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
