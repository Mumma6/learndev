// This project uses the nodemailer library to send email
// However, it is recommended to switch over to dedicated email services
// like Mailgun, AWS SES, etc.
import nodemailer from "nodemailer"
import { MailOptions } from "nodemailer/lib/json-transport"

console.log(process.env.NODEMAILER_CONFIG)

const nodemailerConfig = process.env.NODEMAILER_CONFIG ? JSON.parse(process.env.NODEMAILER_CONFIG) : {}

const config = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "learndev.io@gmail.com",
    pass: "wcztmbihpzubjwgo",
  },
}

const transporter = nodemailer.createTransport(config)

export async function sendMail({ from, to, subject, html }: MailOptions) {
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    })
  } catch (e: any) {
    console.log(e)
    throw new Error(`Could not send email: ${e.message}`)
  }
}

export const CONFIG = {
  from: nodemailerConfig?.auth?.user,
}
