export type QueryParams = {
  page?: number
  limit?: number
  name?: string
  status?: boolean
  slug?: string
  brand?: string
  sortBy?: 'created_at' | 'name'
  order?: 'ASC' | 'DESC'
}