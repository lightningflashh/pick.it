
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

import { env } from '~/config/environment'

const mailerSendInstance = new MailerSend({ apiKey: env.MAILER_SEND_API_KEY as string })

const sendFrom = new Sender(env.ADMIN_SENDER_EMAIL as string, env.ADMIN_SENDER_NAME as string)

interface EmailOptions {
  to: string
  toName: string
  subject: string
  html: string
}

const sendEmail = async ({ to, toName, subject, html }: EmailOptions) => {
  try {
    const recipient = [new Recipient(to, toName)]

    const emailParams = new EmailParams()
      .setFrom(sendFrom)
      .setTo(recipient)
      .setReplyTo(sendFrom)
      .setSubject(subject)
      .setHtml(html)
    const response = await mailerSendInstance.email.send(emailParams)
    return response
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const MailerSendProvider = {
  sendEmail
}