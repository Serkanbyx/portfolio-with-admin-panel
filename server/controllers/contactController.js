const config = require("../config/env");
const sendEmail = require("../utils/sendEmail");
const { escapeHtml } = require("../utils/helpers");

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeMessage = escapeHtml(message.trim());

    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "UTC",
    });

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f7; font-family:'Segoe UI', Roboto, Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:40px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding:32px 40px; text-align:center;">
                    <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:0.5px;">Portfolio Contact</h1>
                    <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">New message from your portfolio</p>
                  </td>
                </tr>

                <!-- Sender Info -->
                <tr>
                  <td style="padding:32px 40px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fc; border-radius:6px; padding:20px;">
                      <tr>
                        <td style="padding:0 0 12px;">
                          <span style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#8893a7; margin-bottom:4px;">From</span>
                          <span style="font-size:16px; font-weight:600; color:#2d3748;">${safeName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#8893a7; margin-bottom:4px;">Email</span>
                          <a href="mailto:${safeEmail}" style="font-size:15px; color:#667eea; text-decoration:none;">${safeEmail}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Message Body -->
                <tr>
                  <td style="padding:24px 40px;">
                    <h2 style="margin:0 0 12px; font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#8893a7;">Message</h2>
                    <div style="font-size:15px; line-height:1.7; color:#4a5568; white-space:pre-wrap;">${safeMessage}</div>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 40px;">
                    <hr style="border:none; border-top:1px solid #e8ecf1; margin:0;" />
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px 28px; text-align:center;">
                    <p style="margin:0; font-size:12px; color:#a0aec0;">Received on ${timestamp} (UTC)</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await sendEmail({
      from: config.smtpUser,
      to: config.contactToEmail,
      replyTo: email.trim(),
      subject: `Portfolio Contact: ${safeName}`,
      html,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact email error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

module.exports = { sendContactMessage };
