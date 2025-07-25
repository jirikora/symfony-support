export default function memoryStorage<T>() {
  const items = new Map<string, T>()
  return {
    id: 'memory',
    get(key: string) {
      return items.get(key)
    },
    set(key: string, value: T) {
      items.set(key, value)

      return items.get(key)
    },
  }
}
