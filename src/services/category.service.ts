import { categoryRepository as repo } from '~/repositories/categoryRepository'
import { Category } from '~/entities/Category'

const createNew = async (payload: { name: string; slug: string }) => {
  const exist = await repo.findByNameOrSlug(payload.name, payload.slug)

  if (exist) {
    throw new Error('Category name or slug already exists')
  }

  const category = repo.create(payload)
  return await repo.save(category)
}

const findAll = async () => {
  return await repo.findAll()
}

const findById = async (id: string) => {
  const category = await repo.findById(id)

  if (!category) {
    throw new Error('Category not found')
  }

  return category
}

const update = async (id: string, payload: Partial<Category>) => {
  const category = await findById(id)

  if (payload.name || payload.slug) {
    const exist = await repo.findByNameOrSlug(payload.name || '', payload.slug || '')

    if (exist && exist.category_id !== parseInt(id)) {
      throw new Error('Category name or slug already exists')
    }
  }

  Object.assign(category, payload)
  return await repo.save(category)
}

const remove = async (id: string) => {
  const category = await findById(id)
  return await repo.remove(category)
}

export const categoryService = {
  createNew,
  findAll,
  findById,
  update,
  remove
}
