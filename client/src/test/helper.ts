import * as path from 'path'
import * as vscode from 'vscode'

export let doc: vscode.TextDocument
export let editor: vscode.TextEditor
export let documentEol: string
export let platformEol: string

export async function activate(docUri: vscode.Uri) {
  const ext = vscode.extensions.getExtension('jirikora.symfony-support')!
  await ext.activate()
  try {
    doc = await vscode.workspace.openTextDocument(docUri)
    editor = await vscode.window.showTextDocument(doc)
  } catch (e) {
    console.error(e)
  }
}

export const getDocPath = (p: string) => {
  return path.resolve(__dirname, '../../testFixture', p)
}

export const getDocUri = (p: string) => {
  return vscode.Uri.file(getDocPath(p))
}
