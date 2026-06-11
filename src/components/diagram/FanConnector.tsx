// The layer diagram's 1→3 "split" fan: one source at the top fans into three
// outputs. preserveAspectRatio="none" lets it stretch to the full grid width;
// below 900px the CSS hides it and a single chevron is shown instead.
export function FanConnector() {
  return (
    <svg className="dgm-conn split" viewBox="0 0 600 78" preserveAspectRatio="none" aria-hidden="true">
      <path className="ln" d="M300 2 C300 46 100 28 100 68" />
      <path className="ln" d="M300 2 L300 68" />
      <path className="ln" d="M300 2 C300 46 500 28 500 68" />
      <path className="hd" d="M94 67 L106 67 L100 78 Z" />
      <path className="hd" d="M294 67 L306 67 L300 78 Z" />
      <path className="hd" d="M494 67 L506 67 L500 78 Z" />
    </svg>
  )
}
