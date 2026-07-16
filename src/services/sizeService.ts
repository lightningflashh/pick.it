import { GET_POSTGRESQL_DB } from '~/config/postgresql'
import { Size } from '~/entities/Size'

const getDataSource = () => GET_POSTGRESQL_DB()

const sizeRepo = () => getDataSource().getRepository(Size)

const create = async (data: any) => {
  const size = sizeRepo().create(data)
  return await sizeRepo().save(size)
}

const update = async (data: any) => {
  const size = await sizeRepo().findOneBy({
    size_id: data.size_id
  })
  if (!size) {
    throw new Error('Size not found')
  }
  Object.assign(size, data)
  return await sizeRepo().save(size)
}

const remove = async (size_id: number) => {
  const size = await sizeRepo().findOneBy({
    size_id
  })
  if (!size) {
    throw new Error('Size not found')
  }
  return await sizeRepo().remove(size)
}

const findAll = async () => {
  return await sizeRepo().find()
}

export const sizeService = {
  create,
  update,
  remove,
  findAll
}
