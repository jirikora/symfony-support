export type Storage<T> = {
  get(key: string): null | T
  set(key: string, value: T): null | T
}
