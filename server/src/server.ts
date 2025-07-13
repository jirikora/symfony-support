import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
} from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { TypedEventEmitter } from './types/message'
import { EventEmitter } from 'node:events'
import twig from './twig'
import definitionHandler from './handler/definitionHandler'

const documents = new TextDocuments(TextDocument)
const connection = createConnection(ProposedFeatures.all)

const emitter = new EventEmitter() as TypedEventEmitter

twig(emitter)

connection.onInitialize((params) => {
  emitter.emit('data', {
    connection: connection,
    workspaceUri: params.workspaceFolders?.at(0)?.uri as string,
  })

  return {
    capabilities: {
      definitionProvider: true,
      // hoverProvider: true,
      // typeDefinitionProvider: true
    },
  }
})

connection.onInitialized(() => {
  connection.console.log('Symfony support initialized')
})

connection.onDefinition((params) => {
  const document = documents.get(params.textDocument.uri)
  if (!document) {
    return null
  }

  const result = definitionHandler(document, params, emitter)
  if (!result) {
    return null
  }

  return Array.isArray(result) ? result : [result]
})

documents.listen(connection)
connection.listen()
