const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const emailUser = process.env.EMAIL_USER || 'innovativesolutions.support.pk@gmail.com';
  const emailPass = process.env.EMAIL_PASS;

  if (!emailPass || emailPass === 'your_gmail_app_password_here' || emailPass === 'your_app_password_here') {
    console.warn('WARNING: Email password is not configured or using placeholder. Email sending will fail.');
    throw new Error('Email service is not configured. Please set a valid EMAIL_PASS in .env');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: `"Innovative Solutions" <${emailUser}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
