import {
  CompletionItem,
  Connection,
  DefinitionLink,
  Hover,
} from 'vscode-languageserver/node'
import TTypedEventEmitter from 'typed-emitter'

export type Data = {
  connection: Connection
  workspaceUri: string
}

type MessageMap = {
  data: (payload: Data) => void
  defintionHandled: (defintion: DefinitionLink) => void
  hoverHandled: (defintion: Hover) => void
  completionHandled: (completionItems: Array<CompletionItem>) => void
}

export type TypedEventEmitter = TTypedEventEmitter<MessageMap>
