import * as assert from 'assert'
import { activate, getDocUri } from './helper'

suite('Simple Test', () => {
  test('Is Test Complete', async () => {
    await activate(getDocUri('test.txt'))

    assert.ok(1 === 1)
  })
})
