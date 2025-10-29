export function contactConfirmationTemplateAdmin({ name, email, message }) {
    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/image/logo PNG.png`;
    const messageIcon = "✅";

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
                margin-bottom: 15px;
            }
            .info-box {
                text-align: left;
                display: inline-block;
                background-color: #f0f0f0;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                font-size: 15px;
            }
            .info-item {
                margin-bottom: 10px;
            }
            .info-item span:first-child {
                font-weight: bold;
                color: #111827;
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
            <h1>New Contact Message ${messageIcon}</h1>
            <p>You have received a new message from the contact form. Details are below:</p>
            <div class="info-box">
                <div class="info-item">
                    <span>Name:</span> <span>${name || "Not Provided"}</span>
                </div>
                <div class="info-item">
                    <span>Email:</span> <span>${email || "Not Provided"}</span>
                </div>
                <div class="info-item">
                    <span>Message:</span> <span>${message || "No message provided"}</span>
                </div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Hecate Wizard Mall. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
}
