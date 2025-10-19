const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmailWithAttachment = async (to, subject, text, attachmentPath) => {
  try {
    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`⚠️  Email not configured. PDF generated at: ${attachmentPath}`);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      attachments: [
        {
          filename: 'Semester_Summary.pdf',
          path: attachmentPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to: ${to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.log(`⚠️  Fallback: PDF generated at: ${attachmentPath}`);
  }
};
