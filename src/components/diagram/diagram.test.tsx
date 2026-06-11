import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DgmNode } from './DgmNode'
import { DgmConnector } from './DgmConnector'
import { FanConnector } from './FanConnector'

describe('diagram primitives', () => {
  it('DgmNode maps variant to the right class and renders children', () => {
    const { container } = render(
      <DgmNode variant="owned">
        <span className="nt">Title</span>
      </DgmNode>,
    )
    const node = container.querySelector('.dgm-node')
    expect(node).toHaveClass('is-owned')
    expect(node).toHaveTextContent('Title')
  })

  it('DgmNode plain variant has no is- modifier', () => {
    const { container } = render(<DgmNode><span>x</span></DgmNode>)
    const node = container.querySelector('.dgm-node')!
    expect(node.className.trim()).toBe('dgm-node')
  })

  it('DgmConnector horizontal uses the 54x16 viewBox', () => {
    const { container } = render(<DgmConnector dir="h" />)
    const svg = container.querySelector('svg.dgm-conn.h')!
    expect(svg.getAttribute('viewBox')).toBe('0 0 54 16')
  })

  it('DgmConnector vertical long uses the 16x46 viewBox', () => {
    const { container } = render(<DgmConnector dir="v" long />)
    const svg = container.querySelector('svg.dgm-conn.v')!
    expect(svg.getAttribute('viewBox')).toBe('0 0 16 46')
  })

  it('DgmConnector passes through an extra className', () => {
    const { container } = render(<DgmConnector dir="v" className="input-vconn" />)
    expect(container.querySelector('.dgm-conn.v.input-vconn')).toBeTruthy()
  })

  it('FanConnector renders the split fan with preserveAspectRatio none', () => {
    const { container } = render(<FanConnector />)
    const svg = container.querySelector('svg.dgm-conn.split')!
    expect(svg.getAttribute('preserveAspectRatio')).toBe('none')
    expect(svg.querySelectorAll('path.ln')).toHaveLength(3)
    expect(svg.querySelectorAll('path.hd')).toHaveLength(3)
  })
})
