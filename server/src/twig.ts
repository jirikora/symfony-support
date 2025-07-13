import { runTwig } from './console'
import { Data, TypedEventEmitter } from './types/message'
import { isSymfonyWorkspace } from './utils'

function onData(data: Data) {
  if (!isSymfonyWorkspace(data.workspaceUri)) {
    data.connection.console.log('This is not Symfony Workspace, Abort!')
  }

  runTwig()
}

export default function twig(emitter: TypedEventEmitter) {
  emitter.on('data', onData)
}
