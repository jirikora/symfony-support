import { TextDocument } from 'vscode-languageserver-textdocument'
import { storageAdapter } from '../storage/storageAdapter'
import {
  CompletionItem,
  CompletionItemKind,
  CompletionParams,
  Position,
} from 'vscode-languageserver'
import { TypedEventEmitter } from '../types/message'

const items = storageAdapter().twig()

function twigHandler() {
  return {
    handle(text: string, position: Position): Array<CompletionItem> {
      const matchers = ['|']
      let start = position.character
      while (start > 0 && !matchers.includes(text.charAt(start))) {
        start--
      }

      if (start <= 0) {
        return []
      }

      const filters = []
      let preFilter = text.substring(start + 1, position.character).trim()
      for (const [_name, twigFilter] of Array.from(
        items.allFilters()
      ).values()) {
        if (twigFilter.name.startsWith(preFilter)) {
          const completionItem = CompletionItem.create(_name || twigFilter.name)
          completionItem.kind = CompletionItemKind.Function
          completionItem.labelDetails = {
            detail: twigFilter.argumentText,
            description: 'filter',
          }

          filters.push(completionItem)
        }
      }

      return filters
    },
    support(document: TextDocument) {
      return ['twig', 'plaintext'].includes(document.languageId)
    },
  }
}

export default function completionHandler(
  document: TextDocument,
  params: CompletionParams,
  emitter: TypedEventEmitter
): Array<CompletionItem> {
  const lineText = document.getText({
    start: { line: params.position.line, character: 0 },
    end: { line: params.position.line + 1, character: 0 },
  })

  for (const handler of [twigHandler()]) {
    if (handler.support(document)) {
      const completionItems = handler.handle(lineText, params.position)
      if (completionItems.length) {
        emitter.emit('completionHandled', completionItems)
      }

      return completionItems
    }
  }

  return []
}
