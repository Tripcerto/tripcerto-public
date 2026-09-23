import { describe, expect, it } from 'vitest'
import { pageAddress, stripAddress } from './address'

describe('addresses that leave the page', () => {
  it('keep the origin and path of the page and nothing after them', () => {
    expect(pageAddress(new URL('https://www.tripcerto.com/engage?utm_source=x#top'))).toBe('https://www.tripcerto.com/engage')
  })

  it('reduce any web address to its origin and path', () => {
    expect(stripAddress('https://www.tripcerto.com/pilot?ref=abc#close')).toBe('https://www.tripcerto.com/pilot')
    expect(stripAddress('http://localhost:5173/')).toBe('http://localhost:5173/')
  })

  it('give nothing for what is not a web address', () => {
    expect(stripAddress('')).toBe('')
    expect(stripAddress('not a url')).toBe('')
    expect(stripAddress('mailto:hello@tripcerto.com')).toBe('')
  })
})
