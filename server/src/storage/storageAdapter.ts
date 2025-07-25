import TwigTemplate from '../model/twigTemplate'
import memoryStorage from './memoryStorage'

const twigStorage = memoryStorage<TwigTemplate>()

const singletonAdapter = {
  twig: () => ({
    get(key: string) {
      return twigStorage.get(key)
    },
    set(key: string, value: TwigTemplate) {
      return twigStorage.set(key, value)
    },
  }),
}

export function storageAdapter() {
  return singletonAdapter
}
