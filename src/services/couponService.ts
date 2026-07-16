import { GET_POSTGRESQL_DB } from '~/config/postgresql'
import { Coupon } from '~/entities/Coupon'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { ILike } from 'typeorm'

const getDataSource = () => GET_POSTGRESQL_DB()

const couponRepo = () => getDataSource().getRepository(Coupon)

const create = async (data: any) => {
  // Check if coupon code already exists
  const existingCoupon = await couponRepo().findOneBy({
    code: data.code
  })

  if (existingCoupon) {
    throw new ApiError(StatusCodes.CONFLICT, 'COUPON_CODE_ALREADY_EXISTS')
  }

  const coupon = couponRepo().create({
    code: data.code,
    discount_type: data.discount_type,
    discount_value: data.discount_value,
    max_discount: data.max_discount,
    min_order_value: data.min_order_value,
    start_date: new Date(data.start_date),
    end_date: new Date(data.end_date),
    usage_limit: data.usage_limit,
    used_count: 0
  })

  return await couponRepo().save(coupon)
}

const findAll = async (params: any = {}) => {
  const { page = 1, limit = 10, code, status } = params
  const skip = (page - 1) * limit

  const where: any = {}

  if (code) {
    where.code = ILike(`%${code}%`)
  }

  // If status is 'active', filter by current date
  if (status === 'active') {
    const now = new Date()
    where.start_date = { $lte: now }
    where.end_date = { $gte: now }
  } else if (status === 'expired') {
    const now = new Date()
    where.end_date = { $lt: now }
  } else if (status === 'upcoming') {
    const now = new Date()
    where.start_date = { $gt: now }
  }

  const [data, total] = await couponRepo().findAndCount({
    where,
    skip,
    take: limit,
    order: {
      created_at: 'DESC'
    }
  })

  return {
    data: data.map((coupon) => ({
      ...coupon,
      remaining_uses: coupon.usage_limit - coupon.used_count,
      is_expired: new Date() > coupon.end_date,
      is_active: new Date() >= coupon.start_date && new Date() <= coupon.end_date
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

const findById = async (couponId: number) => {
  const coupon = await couponRepo().findOneBy({
    coupon_id: couponId
  })

  if (!coupon) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'COUPON_NOT_FOUND')
  }

  return {
    ...coupon,
    remaining_uses: coupon.usage_limit - coupon.used_count,
    is_expired: new Date() > coupon.end_date,
    is_active: new Date() >= coupon.start_date && new Date() <= coupon.end_date
  }
}

const findByCode = async (code: string) => {
  const coupon = await couponRepo().findOneBy({
    code
  })

  if (!coupon) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'COUPON_NOT_FOUND')
  }

  const now = new Date()
  if (now < coupon.start_date || now > coupon.end_date) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'COUPON_EXPIRED')
  }

  if (coupon.used_count >= coupon.usage_limit) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'COUPON_USAGE_LIMIT_EXCEEDED')
  }

  return {
    ...coupon,
    remaining_uses: coupon.usage_limit - coupon.used_count,
    is_expired: new Date() > coupon.end_date,
    is_active: new Date() >= coupon.start_date && new Date() <= coupon.end_date
  }
}

const update = async (data: any) => {
  const coupon = await couponRepo().findOneBy({
    coupon_id: data.coupon_id
  })

  if (!coupon) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'COUPON_NOT_FOUND')
  }

  if (data.discount_type) {
    coupon.discount_type = data.discount_type
  }

  if (data.discount_value !== undefined) {
    coupon.discount_value = data.discount_value
  }

  if (data.max_discount !== undefined) {
    coupon.max_discount = data.max_discount
  }

  if (data.min_order_value !== undefined) {
    coupon.min_order_value = data.min_order_value
  }

  if (data.start_date) {
    coupon.start_date = new Date(data.start_date)
  }

  if (data.end_date) {
    coupon.end_date = new Date(data.end_date)
  }

  if (data.usage_limit !== undefined) {
    coupon.usage_limit = data.usage_limit
  }

  return await couponRepo().save(coupon)
}

const remove = async (couponId: number) => {
  const coupon = await couponRepo().findOneBy({
    coupon_id: couponId
  })

  if (!coupon) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'COUPON_NOT_FOUND')
  }

  return await couponRepo().remove(coupon)
}

export const couponService = {
  create,
  findAll,
  findById,
  findByCode,
  update,
  remove
}
