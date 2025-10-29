export function welcomeEmailTemplate({ name, email, password }) {
    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/image/logo PNG.png`;

    return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; padding: 40px 0;">
        <!-- Card -->
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #ddd;">
            
            <!-- Header -->
            <div style="padding: 30px; text-align: center; background: #000;">
                <img src="${logoUrl}" alt="Hecate Wizard Mall Logo" style="width: 120px; margin-bottom: 10px;" />
                <h1 style="color: #fff; font-size: 24px; margin: 0;">Welcome, ${name}!</h1>
            </div>

            <!-- Body -->
            <div style="padding: 30px; color: #333; line-height: 1.6;">
                <p style="font-size: 16px;">Your account has been successfully created. Here are your login credentials:</p>

                <!-- Modern credentials box -->
                <div style="display: flex; flex-direction: column; gap: 10px; margin: 20px 0;">
                    <div style="display: flex; justify-content: space-between; padding: 12px 20px; background: #f0f0f0; border-radius: 8px;">
                        <span style="font-weight: bold;">Email:</span>
                        <span>${email}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 20px; background: #f0f0f0; border-radius: 8px;">
                        <span style="font-weight: bold;">Password:</span>
                        <span>${password}</span>
                    </div>
                </div>

                <p style="font-size: 14px; color: #888; margin-top: 30px; text-align: center;">
                    &copy; ${new Date().getFullYear()} Hecate Wizard Mall. All rights reserved.
                </p>
            </div>
        </div>
    </div>
    `;
}
