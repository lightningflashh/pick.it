import { FindOptionsWhere, ILike } from 'typeorm'
import { GET_POSTGRESQL_DB } from '~/config/postgresql'
import { Category } from '~/entities/Category'
import { Product } from '~/entities/Product'
import { QueryParams } from '~/types/Product/queries'

const getDataSource = () => GET_POSTGRESQL_DB()

const productRepo = () => getDataSource().getRepository(Product)
const categoryRepo = () => getDataSource().getRepository(Category)

const create = async (data: any) => {
  const category = await categoryRepo().findOneBy({
    slug: data.category_slug
  })

  if (!category) {
    throw new Error('CATEGORY_NOT_FOUND')
  }

  const product = productRepo().create({
    ...data,
    category
  })

  return await productRepo().save(product)
}

const update = async (data: any) => {
  const product = await productRepo().findOneBy({
    product_id: data.product_id
  })

  if (!product) {
    throw new Error('PRODUCT_NOT_FOUND')
  }

  if (data.category_slug) {
    const category = await categoryRepo().findOneBy({
      slug: data.category_slug
    })

    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND')
    }

    product.category = category
  }

  Object.assign(product, data)

  return await productRepo().save(product)
}

const findAll = async (params: QueryParams) => {
  const { page = 1, limit = 10, name, status, slug, brand, sortBy = 'created_at', order = 'DESC' } = params

  const skip = (page - 1) * limit

  const where: FindOptionsWhere<Product> = {}

  if (name) {
    where.name = ILike(`%${name}%`)
  }

  if (status !== undefined) {
    where.status = status
  }

  if (slug) {
    where.category = { slug } as any
  }

  if (brand) {
    where.brand = ILike(`%${brand}%`)
  }

  const [data, total] = await productRepo().findAndCount({
    where,
    skip,
    take: limit,
    order: {
      [sortBy]: order
    }
  })

  return {
    data: data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

const findById = (id: string) => {
  return productRepo().findOne({
    where: { product_id: id }
  })
}

const findByNameOrSlug = (name: string, slug: string) => {
  return productRepo().findOne({
    where: [{ name }, { category: { slug } }]
  })
}

const remove = async (id: string) => {
  const product = await findById(id)
  if (!product) throw new Error('PRODUCT_NOT_FOUND')

  return productRepo().remove(product)
}

export const productService = {
  create,
  update,
  findAll,
  findById,
  findByNameOrSlug,
  remove
}
