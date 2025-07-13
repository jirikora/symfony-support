import { Connection, DefinitionLink } from 'vscode-languageserver/node'
import TTypedEventEmitter from 'typed-emitter'

export type Data = {
  connection: Connection
  workspaceUri: string
}

type MessageMap = {
  data: (payload: Data) => void
  defintionHandled: (defintion: DefinitionLink) => void
}

export type TypedEventEmitter = TTypedEventEmitter<MessageMap>
