import TwigTemplate from '../model/twigTemplate'
import memoryStorage from './memoryStorage'

const twigStorage = memoryStorage<TwigTemplate>()

export function storageAdapter() {
  return {
    twig() {
      return {
        get(key: string) {
          return twigStorage.get(key)
        },
        set(key: string, value: TwigTemplate) {
          return twigStorage.set(key, value)
        },
      }
    },
  }
}
