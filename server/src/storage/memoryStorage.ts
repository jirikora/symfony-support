export default function memoryStorage<T>() {
  const items = new Map<string, T>()
  return {
    id: 'memory',
    all() {
      return items
    },
    get(key: string) {
      return items.get(key)
    },
    set(key: string, value: T) {
      items.set(key, value)

      return items.get(key)
    },
  }
}
