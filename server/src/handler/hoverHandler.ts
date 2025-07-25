import { TextDocument } from 'vscode-languageserver-textdocument'
import { storageAdapter } from '../storage/storageAdapter'
import { Hover, HoverParams, Position, Range } from 'vscode-languageserver'
import { TypedEventEmitter } from '../types/message'

const items = storageAdapter().twig()

function phpHandler() {
  return {
    handle(text: string, position: Position): null | Hover {
      const matchers = ["'", '"', ' ']
      let start = position.character
      while (start > 0 && !matchers.includes(text.charAt(start))) {
        start--
      }

      let end = position.character
      while (end < text.length && !matchers.includes(text.charAt(end))) {
        end++
      }

      const name = text.slice(start + 1, end)
      const item = items.get(name)

      if (!item) {
        return null
      }

      return {
        contents: item.path,
        range: Range.create(
          Position.create(position.line, start),
          Position.create(position.line, end)
        ),
      } as Hover
    },
    support(document: TextDocument) {
      return ['php', 'twig', 'plaintext'].includes(document.languageId)
    },
  }
}

export default function hoverHandler(
  document: TextDocument,
  params: HoverParams,
  emitter: TypedEventEmitter
): null | Hover {
  const lineText = document.getText({
    start: { line: params.position.line, character: 0 },
    end: { line: params.position.line + 1, character: 0 },
  })

  for (const handler of [phpHandler()]) {
    if (handler.support(document)) {
      const hover = handler.handle(lineText, params.position)
      if (null !== hover) {
        emitter.emit('hoverHandled', hover)
      }

      return hover
    }
  }

  return null
}
