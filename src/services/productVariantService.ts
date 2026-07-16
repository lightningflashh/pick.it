import { GET_POSTGRESQL_DB } from '~/config/postgresql'
import { Color } from '~/entities/Color'
import { Product } from '~/entities/Product'
import { ProductVariant } from '~/entities/ProductVariant'
import { Size } from '~/entities/Size'
import { ProductVariantQueryParams } from '~/types/ProductVariant/queries'

const getDataSource = () => GET_POSTGRESQL_DB()

const variantRepo = () => getDataSource().getRepository(ProductVariant)
const productRepo = () => getDataSource().getRepository(Product)
const colorRepo = () => getDataSource().getRepository(Color)
const sizeRepo = () => getDataSource().getRepository(Size)

const create = async (data: any) => {
  const product = await productRepo().findOneBy({ product_id: data.product_id })
  if (!product) {
    throw new Error('PRODUCT_NOT_FOUND')
  }

  const color = await colorRepo().findOneBy({ color_id: data.color_id })
  if (!color) {
    throw new Error('COLOR_NOT_FOUND')
  }

  const size = await sizeRepo().findOneBy({ size_id: data.size_id })
  if (!size) {
    throw new Error('SIZE_NOT_FOUND')
  }

  const variant = variantRepo().create({
    product,
    color,
    size,
    stock: data.stock,
    price: data.price
  })

  return await variantRepo().save(variant)
}

const findAll = async (params: ProductVariantQueryParams) => {
  const {
    page = 1,
    limit = 10,
    product_id,
    color_id,
    size_id,
    minStock,
    maxStock,
    minPrice,
    maxPrice,
    sortBy = 'created_at',
    order = 'DESC'
  } = params

  const skip = (page - 1) * limit

  const queryBuilder = variantRepo()
    .createQueryBuilder('variant')
    .leftJoinAndSelect('variant.product', 'product')
    .leftJoinAndSelect('variant.color', 'color')
    .leftJoinAndSelect('variant.size', 'size')

  if (product_id) {
    queryBuilder.andWhere('product.product_id = :product_id', { product_id })
  }

  if (color_id) {
    queryBuilder.andWhere('color.color_id = :color_id', { color_id })
  }

  if (size_id) {
    queryBuilder.andWhere('size.size_id = :size_id', { size_id })
  }

  if (minStock !== undefined) {
    queryBuilder.andWhere('variant.stock >= :minStock', { minStock })
  }

  if (maxStock !== undefined) {
    queryBuilder.andWhere('variant.stock <= :maxStock', { maxStock })
  }

  if (minPrice !== undefined) {
    queryBuilder.andWhere('variant.price >= :minPrice', { minPrice })
  }

  if (maxPrice !== undefined) {
    queryBuilder.andWhere('variant.price <= :maxPrice', { maxPrice })
  }

  const [data, total] = await queryBuilder.orderBy(`variant.${sortBy}`, order).skip(skip).take(limit).getManyAndCount()

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

const findById = async (id: string) => {
  return await variantRepo().findOne({
    where: { variant_id: id },
    relations: {
      product: true,
      color: true,
      size: true
    }
  })
}

const findByProductId = async (product_id: string) => {
  const product = await productRepo().findOneBy({ product_id })
  if (!product) {
    throw new Error('PRODUCT_NOT_FOUND')
  }

  return await variantRepo().find({
    where: {
      product: { product_id }
    },
    relations: {
      product: true,
      color: true,
      size: true
    }
  })
}

const update = async (data: any) => {
  const variant = await variantRepo().findOne({
    where: { variant_id: data.variant_id },
    relations: {
      product: true,
      color: true,
      size: true
    }
  })

  if (!variant) {
    throw new Error('PRODUCT_VARIANT_NOT_FOUND')
  }

  if (data.product_id) {
    const product = await productRepo().findOneBy({ product_id: data.product_id })
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND')
    }
    variant.product = product
  }

  if (data.color_id) {
    const color = await colorRepo().findOneBy({ color_id: data.color_id })
    if (!color) {
      throw new Error('COLOR_NOT_FOUND')
    }
    variant.color = color
  }

  if (data.size_id) {
    const size = await sizeRepo().findOneBy({ size_id: data.size_id })
    if (!size) {
      throw new Error('SIZE_NOT_FOUND')
    }
    variant.size = size
  }

  if (data.stock !== undefined) {
    variant.stock = data.stock
  }

  if (data.price !== undefined) {
    variant.price = data.price
  }

  return await variantRepo().save(variant)
}

const remove = async (id: string) => {
  const variant = await findById(id)
  if (!variant) {
    throw new Error('PRODUCT_VARIANT_NOT_FOUND')
  }

  return await variantRepo().remove(variant)
}

export const productVariantService = {
  create,
  findAll,
  findById,
  findByProductId,
  update,
  remove
}
