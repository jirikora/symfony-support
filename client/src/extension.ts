import * as path from 'path'
import { workspace, ExtensionContext, window, StatusBarAlignment } from 'vscode'

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  State,
  TransportKind,
} from 'vscode-languageclient/node'

let client: LanguageClient

export function activate(context: ExtensionContext) {
  const statusBar = window.createStatusBarItem(StatusBarAlignment.Left)
  statusBar.text = '$(loading~spin) Symfony support starting'
  statusBar.show()

  // The server is implemented in node
  const serverModule = context.asAbsolutePath(
    path.join('server', 'out', 'server.js')
  )

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
  }

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [
      { scheme: 'file', language: 'php' },
      { scheme: 'file', language: 'plaintext' },
      { scheme: 'file', language: 'twig' },
    ],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
    },
  }

  // Create the language client and start the client.
  client = new LanguageClient(
    'symfony',
    'Symfony Language (Framework) Server',
    serverOptions,
    clientOptions
  )

  // Start the client. This will also launch the server
  client.start()

  client.onDidChangeState(({ newState }) => {
    if (newState === State.Running) {
      statusBar.text = '$(check-all~spin) Symfony support started'
      statusBar.tooltip = 'Accepting request...'
    }
  })
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined
  }
  return client.stop()
}
