/* Whether something is wholly on screen, from how much of its height is
   visible: all of it, or, when it is taller than the screen, as much of the
   screen as it can fill. A pixel of rounding is allowed for. */
export function inFullView(visible: number, height: number, screen: number): boolean {
  return visible > 0 && visible >= Math.min(height, screen) - 1
}
