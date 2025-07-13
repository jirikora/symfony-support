import { URI } from 'vscode-uri'

export default class TwigTemplate {
  constructor(public path: string, public metadata: Record<string, object> = {}) {}

  uri() {
    return URI.file(this.path)
  }
}
