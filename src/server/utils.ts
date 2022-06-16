interface Page<T> {
  items: Array<T>;
  prev?: number;
  next?: number;
  current?: number;
  first?: number;
  last?: number;
}

export function getPage<T>(array: T[], page: number, perPage: number): Page<T> {
  const start = (page - 1) * perPage
  const end = page * perPage

  const obj: Page<T> = { items: array.slice(start, end) }
  if (obj.items.length === 0) {
    return obj;
  }

  if (page > 1) {
    obj.prev = page - 1
  }

  if (end < array.length) {
    obj.next = page + 1
  }

  if (obj.items.length !== array.length) {
    obj.current = page
    obj.first = 1
    obj.last = Math.ceil(array.length / perPage)
  }

  return obj
}

export default { getPage };