export type ProductVariantQueryParams = {
  page?: number
  limit?: number
  product_id?: string
  color_id?: number
  size_id?: number
  minStock?: number
  maxStock?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: 'created_at' | 'stock' | 'price'
  order?: 'ASC' | 'DESC'
}
