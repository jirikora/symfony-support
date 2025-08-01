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
  function filterHandler(
    text: string,
    position: Position
  ): Array<CompletionItem> {
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
    for (const [_name, twigFilter] of Array.from(items.allFilters()).values()) {
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
  }

  function functionHandler(
    text: string,
    position: Position
  ): Array<CompletionItem> {
    const matchers = ['{']
    let start = position.character
    while (start > 0 && !matchers.includes(text.charAt(start))) {
      start--
      if (matchers.includes(text.charAt(start - 1))) {
        start--
        break
      }
    }

    if (start <= 0) {
      return []
    }

    const functions = []
    let preFunction = text.substring(start + 2, position.character).trim()
    for (const [_name, twigFunction] of Array.from(
      items.allFunctions()
    ).values()) {
      if (twigFunction.name.startsWith(preFunction)) {
        const completionItem = CompletionItem.create(_name || twigFunction.name)
        completionItem.kind = CompletionItemKind.Function
        completionItem.labelDetails = {
          detail: twigFunction.argumentText,
          description: 'function',
        }

        functions.push(completionItem)
      }
    }
    return functions
  }

  return {
    handle(text: string, position: Position): Array<CompletionItem> {
      let completions = []
      for (let _handler of [filterHandler, functionHandler]) {
        completions.push(..._handler(text, position))
      }

      return completions
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
