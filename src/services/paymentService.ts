import { Request, Response } from 'express'
import moment from 'moment'
import qs from 'qs'
import crypto from 'crypto'
import { sortObject } from '~/utils/formatters'
import axios from 'axios'

const createPaymentUrl = (req: Request, res: Response) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh'

  const date = new Date()
  const createDate = moment(date).format('YYYYMMDDHHmmss')

  const ipAddr =
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress

  const tmnCode = process.env.VNPAY_TMNCODE as string
  const secretKey = process.env.VNPAY_HASHSECRET as string
  let vnpUrl = process.env.VNPAY_URL as string
  const returnUrl = process.env.VNPAY_RETURNURL as string

  const orderId = moment(date).format('DDHHmmss')
  const amount = req.body.amount
  const bankCode = req.body.bankCode

  // eslint-disable-next-line prefer-const
  let locale = req.body.language || 'vn'

  let vnp_Params: any = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan cho ma GD:${orderId}`,
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  }

  if (bankCode) {
    vnp_Params.vnp_BankCode = bankCode
  }

  vnp_Params = sortObject(vnp_Params)

  const signData = qs.stringify(vnp_Params, { encode: false })

  const signed = crypto
    .createHmac('sha512', secretKey)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex')

  vnp_Params.vnp_SecureHash = signed

  vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false })

  return res.redirect(vnpUrl)
}

const handleVnpayReturn = (req: Request, res: Response) => {
  let vnp_Params: any = { ...req.query }

  const secureHash = vnp_Params.vnp_SecureHash

  delete vnp_Params.vnp_SecureHash
  delete vnp_Params.vnp_SecureHashType

  vnp_Params = sortObject(vnp_Params)

  const secretKey = process.env.VNPAY_HASHSECRET as string

  const signData = qs.stringify(vnp_Params, { encode: false })

  const signed = crypto
    .createHmac('sha512', secretKey)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex')

  if (secureHash === signed) {
    const responseCode = vnp_Params.vnp_ResponseCode
    const orderId = vnp_Params.vnp_TxnRef
    const amount = vnp_Params.vnp_Amount / 100

    if (responseCode === '00') {
      return res.render('success', {
        code: '00',
        message: 'Thanh toán thành công',
        orderId,
        amount
      })
    }

    return res.render('success', {
      code: responseCode,
      message: 'Thanh toán thất bại'
    })
  }

  return res.render('success', {
    code: '97',
    message: 'Checksum không hợp lệ'
  })
}

const handleVnpayIpn = (req: Request, res: Response) => {
  let vnp_Params: any = { ...req.query }

  const secureHash = vnp_Params.vnp_SecureHash
  const rspCode = vnp_Params.vnp_ResponseCode

  delete vnp_Params.vnp_SecureHash
  delete vnp_Params.vnp_SecureHashType

  vnp_Params = sortObject(vnp_Params)

  const secretKey = process.env.VNPAY_HASHSECRET as string

  const signData = qs.stringify(vnp_Params, { encode: false })

  const signed = crypto
    .createHmac('sha512', secretKey)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex')

  if (secureHash === signed) {
    // TODO: check DB

    if (rspCode === '00') {
      return res.status(200).json({ RspCode: '00', Message: 'Success' })
    }

    return res.status(200).json({ RspCode: '00', Message: 'Success' })
  }

  return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' })
}

const queryDr = async (req: Request, res: Response) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh'

  const date = new Date()

  const vnp_TmnCode = process.env.VNPAY_TMNCODE as string
  const secretKey = process.env.VNPAY_HASHSECRET as string
  const vnp_Api = process.env.VNPAY_API as string

  const vnp_TxnRef = req.body.orderId
  const vnp_TransactionDate = req.body.transDate

  const vnp_RequestId = moment(date).format('HHmmss')
  const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss')

  const vnp_IpAddr =
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress

  const data = [
    vnp_RequestId,
    '2.1.0',
    'querydr',
    vnp_TmnCode,
    vnp_TxnRef,
    vnp_TransactionDate,
    vnp_CreateDate,
    vnp_IpAddr,
    `Truy van GD ma:${vnp_TxnRef}`
  ].join('|')

  const vnp_SecureHash = crypto
    .createHmac('sha512', secretKey)
    .update(Buffer.from(data, 'utf-8'))
    .digest('hex')

  const dataObj = {
    vnp_RequestId,
    vnp_Version: '2.1.0',
    vnp_Command: 'querydr',
    vnp_TmnCode,
    vnp_TxnRef,
    vnp_OrderInfo: `Truy van GD ma:${vnp_TxnRef}`,
    vnp_TransactionDate,
    vnp_CreateDate,
    vnp_IpAddr,
    vnp_SecureHash
  }

  try {
    const response = await axios.post(vnp_Api, dataObj)

    return res.json(response.data)
  } catch (error: any) {
    return res.status(500).json({
      message: 'Call VNPAY failed',
      error: error.message
    })
  }
}

export const paymentService = {
  createPaymentUrl,
  handleVnpayReturn,
  handleVnpayIpn,
  queryDr
}