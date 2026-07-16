/* eslint-disable prefer-const */
import { pick } from 'lodash'

export const slugify = (val: any) => {
  if (!val) return ''
  return String(val)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
}

export const pickUser = (user: any) => {
  if (!user) return {}
  return pick(user, [
    'user_id',
    'email',
    'full_name',
    'phone',
    'address',
    'role',
    'is_active',
    'created_at',
    'updated_at'
  ])
}


export const sortObject = (obj: any) => {
  const sorted: any = {}
  const keys = Object.keys(obj)
    .map(k => encodeURIComponent(k))
    .sort()

  keys.forEach(key => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+')
  })

  return sorted
}

