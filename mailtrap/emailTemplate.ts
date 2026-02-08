export const emailVerificationTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background:#48D1CC; padding:20px; text-align:center; color:#ffffff;">
                <h1 style="margin:0; font-size:24px;">Myanmar Coastal Journey</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333333;">
                <h2 style="margin-top:0;">Verify Your Email</h2>

                <p style="font-size:15px; line-height:1.6;">
                  Hi there,<br /><br />
                  Thanks for signing up! Please use the verification code below to confirm your email address.
                </p>

                <!-- Verification Code -->
                <div style="margin:30px 0; text-align:center;">
                  <span style="
                    display:inline-block;
                    padding:15px 30px;
                    font-size:28px;
                    letter-spacing:6px;
                    background:#f0f2ff;
                    color:#48D1CC;
                    border-radius:6px;
                    font-weight:bold;
                  ">
                    {verifyCode}
                  </span>
                </div>

                <p style="font-size:14px; color:#555;">
                   This code will expire in <b>15 minutes</b>.
                </p>

                <p style="font-size:14px; color:#777;">
                  If you didn’t request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
            

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`