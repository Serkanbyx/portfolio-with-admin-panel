const nodemailer = require("nodemailer");
const config = require("../config/env");

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
  // Force IPv4 — many cloud providers (Render, Railway) lack IPv6 egress
  family: 4,
});

const sendEmail = async ({ to, subject, html, from, replyTo }) => {
  const mailOptions = {
    from: from || config.smtpUser,
    to,
    subject,
    html,
    ...(replyTo && { replyTo }),
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
