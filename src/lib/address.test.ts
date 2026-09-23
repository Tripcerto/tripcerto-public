import { describe, expect, it } from 'vitest'
import { analyticsAddress, pageAddress } from './address'

describe('the page, as origin and path', () => {
  it('keeps nothing after the path, campaign tags included', () => {
    expect(pageAddress(new URL('https://www.tripcerto.com/engage?utm_source=x#top'))).toBe('https://www.tripcerto.com/engage')
  })
})

/* GA credits a visit to LinkedIn, an email or a partner's link only by the
   utm_* tags on the address, so an analytics address keeps those and
   nothing else from the query. */
describe('an address as analytics receives it', () => {
  it('keeps the campaign tags and drops every other parameter and the hash', () => {
    expect(analyticsAddress('https://www.tripcerto.com/pilot?utm_source=li&ref=abc#close')).toBe('https://www.tripcerto.com/pilot?utm_source=li')
  })

  it('drops a query that carries no campaign tag', () => {
    expect(analyticsAddress('https://www.tripcerto.com/pilot?ref=abc#close')).toBe('https://www.tripcerto.com/pilot')
    expect(analyticsAddress('https://www.tripcerto.com/pilot?#x')).toBe('https://www.tripcerto.com/pilot')
    expect(analyticsAddress('https://www.tripcerto.com')).toBe('https://www.tripcerto.com/')
    expect(analyticsAddress('http://localhost:5173/')).toBe('http://localhost:5173/')
  })

  it('keeps all six tags in the order they came, exactly as written', () => {
    expect(
      analyticsAddress(
        'https://www.tripcerto.com/engage?utm_campaign=spring%20sale&email=a%40b.c&utm_source=li&utm_medium=social' +
          '&utm_term=safari+kenya&utm_content=hero&utm_id=7&utm_source_platform=x&UTM_SOURCE=y',
      ),
    ).toBe('https://www.tripcerto.com/engage?utm_campaign=spring%20sale&utm_source=li&utm_medium=social&utm_term=safari+kenya&utm_content=hero&utm_id=7')
  })

  it('drops credentials in the authority', () => {
    expect(analyticsAddress('https://user:secret@www.tripcerto.com/pilot?utm_source=li')).toBe('https://www.tripcerto.com/pilot?utm_source=li')
  })

  it('gives nothing for what is not a web address', () => {
    expect(analyticsAddress('')).toBe('')
    expect(analyticsAddress('not a url')).toBe('')
    expect(analyticsAddress('mailto:hello@tripcerto.com')).toBe('')
    expect(analyticsAddress('android-app://com.google.android.gm/?utm_source=x')).toBe('')
  })
})
