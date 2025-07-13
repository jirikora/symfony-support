import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { URI, Utils } from 'vscode-uri'

export function getRootPath(workspaceUri: string) {
  return URI.parse(workspaceUri)
}

export function isSymfonyWorkspace(workspaceUri: string) {
  const symfonyLock = Utils.joinPath(getRootPath(workspaceUri), 'symfony.lock')
  return existsSync(symfonyLock.fsPath)
}

export function getAllFilesInDir(dir: string, files: string[] = []) {
  if (!statSync(dir).isDirectory()) {
    return []
  }

  readdirSync(dir).forEach((file) => {
    const path = join(dir, file)
    if (statSync(path).isDirectory()) {
      getAllFilesInDir(path, files)
    } else {
      files.push(path)
    }
  })

  return files
}
