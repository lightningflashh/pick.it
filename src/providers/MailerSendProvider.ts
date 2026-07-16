import axios from 'axios'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

interface EmailOptions {
  to: string
  toName: string
  subject: string
  html: string
}

const mailerClient = axios.create({
  baseURL: 'https://api.mailersend.com/v1',
  timeout: 15000,
  headers: {
    Authorization: `Bearer ${env.MAILER_SEND_API_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const sendEmail = async ({ to, toName, subject, html }: EmailOptions) => {
  const payload = {
    from: {
      email: env.ADMIN_SENDER_EMAIL,
      name: env.ADMIN_SENDER_NAME
    },
    to: [
      {
        email: to,
        name: toName
      }
    ],
    reply_to: {
      email: env.ADMIN_SENDER_EMAIL,
      name: env.ADMIN_SENDER_NAME
    },
    subject,
    html
  }

  const MAX_RETRIES = 3

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await mailerClient.post('/email', payload)

      // console.log('Email sent successfully')
      return response.data
    } catch (error: any) {
      // console.error(`Send email failed (attempt ${attempt})`)

      // Nếu MailerSend trả response lỗi
      if (error.response) {
        console.error({
          status: error.response.status,
          data: error.response.data
        })

        throw new ApiError(500,
          `MailerSend API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
        )
      }

      // Nếu network timeout / DNS / no response
      if (attempt === MAX_RETRIES) {
        throw new ApiError(500,
          `Failed after ${MAX_RETRIES} attempts: ${error.message}`
        )
      }

      // Delay retry 1s
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}

export const MailerSendProvider = {
  sendEmail
}