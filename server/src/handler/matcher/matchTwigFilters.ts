type Match = {
  position: {
    start: number
    end: number
  }
  name: string
}

export default function matchTwigFilters(text: string): Array<Match> {
  return doMatch(text, /\|\s*(\w+)/g, [])
}

function doMatch(
  text: string,
  regex: RegExp,
  matches: Array<Match> = []
): Array<Match> {
  const match = regex.exec(text)
  if (null === match) {
    return matches
  }

  const pipeLength = match[0].length - match[1].length
  matches.push({
    position: {
      start: match.index + pipeLength,
      end: match.index + pipeLength + match[1].length,
    },
    name: match[1].replace(/\|/g, '').trim(),
  })

  return doMatch(text, regex, matches)
}
