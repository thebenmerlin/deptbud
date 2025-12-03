import nodemailer from "nodemailer";
import { Logger } from "./logger";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    Logger.info("Email sent successfully", { to, subject });
  } catch (error) {
    Logger.error("Email sending failed", { to, error });
    throw error;
  }
}

export function expenseApprovalEmail(
  approverEmail: string,
  expenseAmount: number,
  vendorName: string,
  category: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Expense Approval Required</h2>
      <p>A new expense awaits your approval:</p>
      <ul>
        <li><strong>Amount:</strong> ₹${expenseAmount.toLocaleString("en-IN")}</li>
        <li><strong>Vendor:</strong> ${vendorName}</li>
        <li><strong>Category:</strong> ${category}</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/expenses/approve" style="background: #821910; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Expense</a></p>
    </div>
  `;
}

export function expenseStatusEmail(
  userEmail: string,
  status: string,
  amount: number,
  notes?: string
): string {
  const statusColor = status === "APPROVED" ? "green" : "red";
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Expense ${status}</h2>
      <p style="color: ${statusColor}; font-weight: bold; font-size: 18px;">Your expense has been ${status.toLowerCase()}.</p>
      <p><strong>Amount:</strong> ₹${amount.toLocaleString("en-IN")}</p>
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/expenses" style="background: #243169; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Expenses</a></p>
    </div>
  `;
}
