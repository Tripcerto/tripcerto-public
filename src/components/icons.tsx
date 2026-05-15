import type { ReactNode, SVGAttributes } from 'react'

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'width' | 'height' | 'strokeWidth'> {
  size?: number
  sw?: number
}

const Svg = ({ size = 16, sw = 1.6, children, ...rest }: IconProps & { children: ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
)

export const IArrow = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)

export const IArrowDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Svg>
)

export const IPlus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const IMinus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
)

export const ISpark = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </Svg>
)

export const IFilter = (p: IconProps) => (
  <Svg {...p}>
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </Svg>
)

export const IDatabase = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 6c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3zM4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
  </Svg>
)

export const IUsers = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
)

export const IHandoff = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 12H7M14 5l-7 7 7 7" />
    <path d="M3 5v14" />
  </Svg>
)

export const IGauge = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 14l4-4M3.5 14a9 9 0 1 1 17 0" />
  </Svg>
)

export const ILink = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
  </Svg>
)

export const ICode = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
  </Svg>
)

export const IHammer = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 12l-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" />
    <path d="M17.64 15L22 10.64" />
    <path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91z" />
  </Svg>
)
