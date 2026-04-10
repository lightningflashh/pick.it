import { GET_POSTGRESQL_DB } from '~/config/postgresql'
import { Category } from '~/entities/Category'

const getRepo = () => GET_POSTGRESQL_DB().getRepository(Category)

const create = (data: Partial<Category>) => {
  return getRepo().create(data)
}

const save = (category: Category) => {
  return getRepo().save(category)
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

const remove = (category: Category) => {
  return getRepo().remove(category)
}

export const categoryRepository = {
  create,
  save,
  findAll,
  findById,
  findByNameOrSlug,
  remove
}
