import TwigFilter from '../model/twigFilter'
import TwigFunction from '../model/twigFuntion'
import TwigTemplate from '../model/twigTemplate'
import memoryStorage from './memoryStorage'

const twigStorage = memoryStorage<TwigTemplate>()
const twigFilterStorage = memoryStorage<TwigFilter>()
const twigFunctionStorage = memoryStorage<TwigFunction>()

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
    getFunction(name: string) {
      return twigFunctionStorage.get(name)
    },
    addFunction(name: string, Function: TwigFunction) {
      twigFunctionStorage.set(name, Function)
    },
    allFunctions() {
      return twigFunctionStorage.all()
    },
  }),
}

export function storageAdapter() {
  return singletonAdapter
}
