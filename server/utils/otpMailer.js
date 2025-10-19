// utils/OTPMailer.js
const nodemailer = require('nodemailer');

const sendOTP = async (toEmail, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    const mailOptions = {
      from: `"Student Portal" <${process.env.EMAIL_USER}>`,
      to: toEmail,           // <-- dynamic student email
      subject: 'Your OTP for Student Portal',
      text: `Your OTP is: ${otp}. Use this to verify your email.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent successfully to: ${toEmail}`);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
};

module.exports = sendOTP;
