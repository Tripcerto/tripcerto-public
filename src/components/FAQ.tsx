import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IMinus, IPlus } from './icons'

interface Faq {
  q: string
  a: string
}

const FAQS: Faq[] = [
  {
    q: 'Who owns the data?',
    a: 'You. Conversations, briefs, inventory and the customer insight they generate belong to you. Your data is secure, never combined with other partners’ data, and exportable in JSON or CSV at any time.',
  },
  {
    q: 'How is our proprietary data protected?',
    a: 'Your rates, content, inventory, booking history and customer conversations are processed inside an isolated partner environment. They are not pooled across partners and not used to train shared models — the matching intelligence is ours, the proprietary data flowing through it is yours, and it is exportable at any time.',
  },
  {
    q: 'How does Tripcerto differ from a chatbot?',
    a: 'A chatbot answers questions. Tripcerto extracts structured traveller signals, scores them against your catalogue, and hands your team a qualified brief — keeping the insight from every conversation with you, not a model vendor.',
  },
  {
    q: 'What does implementation involve?',
    a: 'You connect your catalogue by CSV import; we auto-extract the concepts that matter and your team approves them before anything goes live. Re-imports are diffed. Qualified briefs are delivered to your inbox today, with CRM and webhook routing on the roadmap.',
  },
  {
    q: 'Which models do you use?',
    a: 'Anthropic’s Claude runs the reasoning loop; OpenAI handles the embeddings that power matching and semantic recall, and generates the structured brief. Your data sits in an isolated, per-partner environment.',
  },
]

function FaqRow({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: Faq
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [maxHeight, setMaxHeight] = useState(0)
  const panelId = `faq-panel-${index}`
  const triggerId = `faq-trigger-${index}`

  // Measure the real content height so long answers never clip (replaces the
  // fixed 240px cap). Re-measure on open/close and on resize.
  useLayoutEffect(() => {
    const measure = () => setMaxHeight(isOpen ? (innerRef.current?.scrollHeight ?? 0) : 0)
    measure()
  }, [isOpen, faq.a])

  useEffect(() => {
    if (!isOpen) return
    const onResize = () => setMaxHeight(innerRef.current?.scrollHeight ?? 0)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isOpen])

  return (
    <div className="faq-row">
      <button
        id={triggerId}
        type="button"
        className="faq-trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{faq.q}</span>
        <span className="faq-icon">{isOpen ? <IMinus size={18} /> : <IPlus size={18} />}</span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="faq-body"
        style={{ maxHeight: `${maxHeight}px`, opacity: isOpen ? 1 : 0 }}
      >
        <div ref={innerRef}>
          <p>{faq.a}</p>
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  const [open, setOpen] = useState<number>(0)
  return (
    <section id="faq" className="band-close">
      <div className="shell faq-grid">
        <div className="reveal">
          <span className="eyebrow">
            <span className="dot" />
            FAQ
          </span>
          <h2 className="section-title" style={{ marginTop: 16 }}>
            Common questions
          </h2>
          <p className="section-sub" style={{ marginTop: 16 }}>
            Can&rsquo;t find what you&rsquo;re looking for? Drop us a line at{' '}
            <a href="mailto:hello@tripcerto.com">hello@tripcerto.com</a> &mdash; we&rsquo;re quick.
          </p>
        </div>
        <div className="reveal">
          {FAQS.map((f, i) => (
            <FaqRow
              key={f.q}
              faq={f}
              index={i}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
