import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { keepPlace } from './place'

/* jsdom lays nothing out, so the page is described by hand: a bar 72px
   tall, and a paragraph in main whose top the test moves as a reflow
   would. */
let top = 0
let stop = () => {}
const paragraph = document.createElement('p')

function set(name: 'innerWidth' | 'scrollY', value: number) {
  Object.defineProperty(window, name, { value, configurable: true })
}

function rect(y: number, height: number) {
  return { top: y, bottom: y + height, height, left: 0, right: 0, width: 0, x: 0, y, toJSON: () => ({}) }
}

beforeEach(() => {
  vi.useFakeTimers()
  const header = document.createElement('header')
  header.getBoundingClientRect = () => rect(0, 72)
  const main = document.createElement('main')
  main.append(paragraph)
  document.body.append(header, main)
  paragraph.getBoundingClientRect = () => rect(top, 200)
  document.elementsFromPoint = () => [paragraph]
  set('innerWidth', 1280)
  set('scrollY', 0)
})

afterEach(() => {
  stop()
  vi.useRealTimers()
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

/* The reader scrolls, and stops with the paragraph's top 30px above the
   point under the bar. */
function scrollTo(paragraphTop: number) {
  set('scrollY', 900)
  top = paragraphTop
  window.dispatchEvent(new Event('scroll'))
  vi.advanceTimersByTime(100)
}

function resize(width: number) {
  set('innerWidth', width)
  window.dispatchEvent(new Event('resize'))
}

describe('keepPlace', () => {
  it('brings the same point of the page back under the bar when the width changes', () => {
    const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})
    stop = keepPlace()
    scrollTo(43)
    /* A narrower window: the text above reflows and the paragraph lands 500px lower. */
    top = 543
    resize(768)
    expect(scrollBy).toHaveBeenCalledWith({ top: 500, behavior: 'instant' })
  })

  it('holds the same share of a block whose own height changed', () => {
    const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})
    stop = keepPlace()
    /* 30px into a 200px paragraph: 15% of the way down it. */
    scrollTo(43)
    paragraph.getBoundingClientRect = () => rect(43, 400)
    resize(390)
    /* 15% of 400 is 60px, so the page moves on by 30px. */
    expect(scrollBy).toHaveBeenCalledWith({ top: 30, behavior: 'instant' })
  })

  it('leaves the page alone when only the height changes, as a phone toolbar does', () => {
    const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})
    stop = keepPlace()
    scrollTo(43)
    top = 543
    window.dispatchEvent(new Event('resize'))
    expect(scrollBy).not.toHaveBeenCalled()
  })

  it('holds nothing at the top of the page', () => {
    const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})
    stop = keepPlace()
    top = 543
    resize(768)
    expect(scrollBy).not.toHaveBeenCalled()
  })

  it('never holds on to the bar or the menu over the page', () => {
    const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})
    const menu = document.querySelector('header')!
    document.elementsFromPoint = () => [menu]
    stop = keepPlace()
    scrollTo(43)
    top = 543
    resize(768)
    expect(scrollBy).not.toHaveBeenCalled()
  })
})
