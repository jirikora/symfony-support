export default class TwigFunction {
  constructor(public name: string, public args: string[]) {}

  get argumentText() {
    return ` (${this.args.join(', ')})`
  }

  get fullName() {
    return `${this.name} ${this.argumentText}`
  }
}
