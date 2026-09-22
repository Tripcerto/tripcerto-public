/* The lower half of the home page has three candidates while Taylor chooses
   (22 Sep): ?lower=a, b or c. The two he does not pick are deleted, as the
   hero's were. */
export type Lower = 'a' | 'b' | 'c'

export function pickLower(): Lower {
  const v = new URLSearchParams(window.location.search).get('lower')
  return v === 'b' || v === 'c' ? v : 'a'
}
