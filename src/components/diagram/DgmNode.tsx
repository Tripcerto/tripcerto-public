import type { ReactNode } from 'react'

type Variant = 'owned' | 'layer' | 'env' | 'plain'

const VARIANT_CLASS: Record<Variant, string> = {
  owned: 'is-owned',
  layer: 'is-layer',
  env: 'is-env',
  plain: '',
}

export function DgmNode({
  variant = 'plain',
  children,
}: {
  variant?: Variant
  children: ReactNode
}) {
  const mod = VARIANT_CLASS[variant]
  return <div className={mod ? `dgm-node ${mod}` : 'dgm-node'}>{children}</div>
}
