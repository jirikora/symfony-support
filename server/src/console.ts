import { spawn } from 'node:child_process'
import { storageAdapter } from './storage/storageAdapter'
import TwigTemplate from './model/twigTemplate'
import { getAllFilesInDir } from './utils'
import { resolve } from 'node:path'
import TwigFilter from './model/twigFilter'
import TwigFunction from './model/twigFuntion'

type Twig = {
  filters: object
  functions: object
  globals: object
  loader_paths: { [key: string]: string[] }
  tests: object
}

export function run(type: string) {
  const term = spawn('php', [
    'bin/console',
    type,
    '--format=json',
    '--no-ansi',
    '--no-interaction',
    '--env=dev',
  ])

  term.stderr.on('data', (data) => {
    console.error(data)
  })

  term.stdout.on('data', (data) => {
    const twig = JSON.parse(data) as Twig

    for (const namespace in twig.loader_paths) {
      for (const path of twig.loader_paths[namespace].reverse()) {
        const files = getAllFilesInDir(path)

        for (const file of files) {
          storageAdapter()
            .twig()
            .set(
              '(None)' === namespace
                ? file.replace(`${path}/`, '')
                : file.replace(path, namespace),
              new TwigTemplate(resolve(file))
            )
        }
      }
    }

    for (const [name, args] of Object.entries(twig.filters)) {
      storageAdapter()
        .twig()
        .addFilter(name, new TwigFilter(name, args ?? []))
    }

    for (const [name, args] of Object.entries(twig.functions)) {
      storageAdapter()
        .twig()
        .addFunction(name, new TwigFunction(name, args ?? []))
    }
  })
}

export function runTwig() {
  return run('debug:twig')
}
