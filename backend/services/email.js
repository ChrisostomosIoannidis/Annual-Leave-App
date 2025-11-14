// backend/services/email.js
import nodemailer from "nodemailer";
import {
  ADMIN_EMAIL,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
} from "../config.js";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: false, // true if you use port 465
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendLeaveRequestEmail(leave, user) {
  if (!ADMIN_EMAIL) return;

  const start = new Date(leave.startDate).toLocaleDateString();
  const end = new Date(leave.endDate).toLocaleDateString();

  const mailOptions = {
    from: `"Annual Leave App" <${SMTP_USER}>`,
    to: ADMIN_EMAIL,
    subject: `New leave request from ${user.name}`,
    text: `
A new leave request has been submitted:

Employee: ${user.name} (${user.email})
Type: ${leave.type}
Dates: ${start} - ${end}
Reason: ${leave.reason || "N/A"}
Status: ${leave.status}

Please log in to the admin panel to approve or reject this request.
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Leave request email sent to admin");
  } catch (err) {
    console.error("Error sending leave request email:", err.message);
  }
}
