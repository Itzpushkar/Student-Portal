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
};
