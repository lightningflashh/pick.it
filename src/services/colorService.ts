import { GET_POSTGRESQL_DB } from '~/config/postgresql'
import { Color } from '~/entities/Color'

const getDataSource = () => GET_POSTGRESQL_DB()

const colorRepo = () => getDataSource().getRepository(Color)

const create = async (data: any) => {
  const color = colorRepo().create(data)
  return await colorRepo().save(color)
}

const update = async (data: any) => {
  const color = await colorRepo().findOneBy({
    color_id: data.color_id
  })
  if (!color) {
    throw new Error('Color not found')
  }
  Object.assign(color, data)
  return await colorRepo().save(color)
}

const remove = async (color_id: number) => {
  const color = await colorRepo().findOneBy({
    color_id
  })
  if (!color) {
    throw new Error('Color not found')
  }
  return await colorRepo().remove(color)
}

const findAll = async () => {
  return await colorRepo().find()
}

export const colorService = {
  create,
  update,
  remove,
  findAll
}
