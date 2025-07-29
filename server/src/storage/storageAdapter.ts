import TwigFilter from '../model/twigFilter'
import TwigTemplate from '../model/twigTemplate'
import memoryStorage from './memoryStorage'

const twigStorage = memoryStorage<TwigTemplate>()
const twigFilterStorage = memoryStorage<TwigFilter>()

const singletonAdapter = {
  twig: () => ({
    get(key: string) {
      return twigStorage.get(key)
    },
    set(key: string, template: TwigTemplate) {
      return twigStorage.set(key, template)
    },
    getFilter(name: string) {
      return twigFilterStorage.get(name)
    },
    addFilter(name: string, filter: TwigFilter) {
      twigFilterStorage.set(name, filter)
    },
    allFilters() {
      return twigFilterStorage.all()
    },
  }),
}

export function storageAdapter() {
  return singletonAdapter
}
