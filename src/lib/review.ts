/* Review scaffolding: `?text=light` inverts the copy on the glass hero and
   the nav to paper, so a white version and a black version can be compared.
   Removed once one is chosen. */
export const LIGHT_TEXT = new URLSearchParams(window.location.search).get('text') === 'light'
