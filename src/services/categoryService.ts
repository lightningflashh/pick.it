import { GET_POSTGRESQL_DB } from '~/config/postgresql'
import { Category } from '~/entities/Category'

const getRepo = () => GET_POSTGRESQL_DB().getRepository(Category)

const create = (data: Partial<Category>) => {
  return getRepo().create(data)
}

const save = (id: string, data: Partial<Category>) => {
  return getRepo().save({ ...data, category_id: parseInt(id) } as Category)
}

const findAll = () => {
  return getRepo().find()
}

const findById = (id: string) => {
  return getRepo().findOne({
    where: { category_id: parseInt(id) }
  })
}

const findByNameOrSlug = (name: string, slug: string) => {
  return getRepo().findOne({
    where: [{ name }, { slug }]
  })
}

const remove = (id: string) => {
  return getRepo().remove({ category_id: parseInt(id) } as Category)
}

export const categoryService = {
  create,
  save,
  findAll,
  findById,
  findByNameOrSlug,
  remove
}
