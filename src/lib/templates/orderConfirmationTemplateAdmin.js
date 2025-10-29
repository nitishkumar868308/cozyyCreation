// lib/templates/orderConfirmationTemplateAdmin.js

export function orderConfirmationTemplateAdmin({ orderId, total, currency }) {
        const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/image/logo PNG.png`;
    return `
  <div style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" 
      style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
      
      <thead>
        <tr>
          <td style="padding:20px;text-align:center;background-color:#ffffff;border-bottom:1px solid #e5e5e5;">
            <img src="${logoUrl}" alt="Store Logo" style="max-width:140px;height:auto;"/>
          </td>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td style="padding:30px;">
            <p style="font-size:15px;color:#333;margin:0 0 20px 0;">
              A new order has been placed. Below are the details:
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
              </table>
            </div>

            <p style="font-size:14px;color:#555;margin-top:25px;">
              Please check the admin panel to process this order.
            </p>

          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td style="background:#fafafa;text-align:center;padding:15px;font-size:12px;color:#666;border-top:1px solid #e5e5e5;">
            © ${new Date().getFullYear()} Your Store. All rights reserved.<br/>
            <a href="#" style="color:#000;text-decoration:none;">Go to Dashboard</a>
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
      }
    </style>
  </div>
  `;
}
