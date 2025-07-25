import {
  DefinitionParams,
  LocationLink,
  DefinitionLink,
  Position,
  Range,
} from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { storageAdapter } from '../storage/storageAdapter'
import { TypedEventEmitter } from '../types/message'

const items = storageAdapter().twig()

function phpHandler() {
  return {
    handle(text: string, position: Position): null | DefinitionLink {
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

      return LocationLink.create(
        item.uri().toString(),
        Range.create(Position.create(0, 0), Position.create(5, 0)),
        Range.create(Position.create(0, 0), Position.create(5, 0)),
        Range.create(
          Position.create(position.line, start),
          Position.create(position.line, end + 1)
        )
      )
    },
    support(document: TextDocument) {
      return ['php', 'twig', 'plaintext'].includes(document.languageId)
    },
  }
}

export default function definitionHandler(
  document: TextDocument,
  params: DefinitionParams,
  emitter: TypedEventEmitter
): null | DefinitionLink {
  const lineText = document.getText({
    start: { line: params.position.line, character: 0 },
    end: { line: params.position.line + 1, character: 0 },
  })

  for (const handler of [phpHandler()]) {
    if (handler.support(document)) {
      const defintion = handler.handle(lineText, params.position)
      if (null !== defintion) {
        emitter.emit('defintionHandled', defintion)
      }

      return defintion
    }
  }

  return null
}
