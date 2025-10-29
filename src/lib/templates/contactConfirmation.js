export function contactConfirmationTemplate({ name, email }) {
    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/image/logo PNG.png`;
    const messageIcon = "✅"; // Custom icon for now

    return `
    <html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
            body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                background-color: #f9fafb;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .email-container {
                max-width: 600px;
                margin: 40px auto;
                padding: 40px 20px;
                text-align: center;
            }
            .logo {
                width: 120px;
                margin-bottom: 30px;
            }
            h1 {
                font-size: 24px;
                margin-bottom: 20px;
            }
            p {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            .footer {
                font-size: 14px;
                color: #888888;
                margin-top: 30px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <img src="${logoUrl}" alt="Logo" class="logo" />
            <h1>Dear ${name || "Valued User"},</h1>
            <p>
                We have successfully received your message. Our team will review it and get back to you shortly. ${messageIcon}
            </p>
            <p>Thank you for reaching out to us!</p>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Hecate Wizard Mall. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
}
