export function orderConfirmationTemplate({ name, orderId, total,currency, downloadLink }) {
    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/image/logo PNG.png`;
  return `
  <div style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" 
      style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
      
      <!-- 🏪 Header with Logo -->
      <thead>
        <tr>
          <td style="padding:20px;text-align:center;background-color:#ffffff;border-bottom:1px solid #e5e5e5;">
            <img src="${logoUrl}" alt="Store Logo" style="max-width:140px;height:auto;"/>
          </td>
        </tr>
      </thead>

      <!-- 📦 Order Info -->
      <tbody>
        <tr>
          <td style="padding:30px;">
            <p style="font-size:16px;color:#000;margin:0 0 10px 0;">Hi <strong>${name}</strong>,</p>
            <p style="font-size:15px;color:#333;margin:0 0 20px 0;">
              Thank you for your order! We’ve received it and it’s now being processed.
            </p>

            <div style="background:#f8f8f8;border-radius:8px;padding:15px;margin-top:15px;">
              <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#000;">
                <tr>
                  <td><strong>Order ID:</strong></td>
                  <td style="text-align:right;">${orderId}</td>
                </tr>
                <tr>
                  <td><strong>Total Amount:</strong></td>
                  <td style="text-align:right;">${currency} ${total}</td>
                </tr>
                <tr>
                  <td><strong>Status:</strong></td>
                  <td style="text-align:right;color:green;font-weight:bold;">Confirmed</td>
                </tr>
              </table>
            </div>

            <!-- 📄 Invoice Button -->
            <div style="text-align:center;margin-top:30px;">
              <a href="${downloadLink}" 
                 style="background:#000;color:#fff;padding:12px 25px;border-radius:6px;
                 text-decoration:none;font-weight:500;display:inline-block;">
                📄 Download Invoice
              </a>
            </div>

            <p style="font-size:14px;color:#555;margin-top:25px;">
              You’ll receive another update once your order is shipped.
              For any questions, simply reply to this email.
            </p>

            <p style="font-size:14px;color:#333;margin-top:20px;">Warm regards,</p>
            <p style="font-weight:600;color:#000;">Hecate Wizard Mall Team</p>
          </td>
        </tr>
      </tbody>

      <!-- ⚙️ Footer -->
      <tfoot>
        <tr>
          <td style="background:#fafafa;text-align:center;padding:15px;font-size:12px;color:#666;border-top:1px solid #e5e5e5;">
            © ${new Date().getFullYear()} Hecate Wizard Mall. All rights reserved.<br/>
            <a href="#" style="color:#000;text-decoration:none;">Visit Store</a> | 
            <a href="#" style="color:#000;text-decoration:none;">Track Order</a>
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- ✅ Responsive Fix -->
    <style>
      @media only screen and (max-width: 600px) {
        table {
          width: 95% !important;
        }
        td {
          padding: 15px !important;
        }
        img {
          max-width: 120px !important;
        }
        p, td {
          font-size: 14px !important;
        }
        a {
          font-size: 14px !important;
          padding: 10px 20px !important;
        }
      }
    </style>
  </div>
  `;
}
