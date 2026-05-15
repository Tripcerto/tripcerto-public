import { useState } from 'react'
import { IMinus, IPlus } from './icons'

interface Faq {
  q: string
  a: string
}

const FAQS: Faq[] = [
  {
    q: 'Who owns the data — us or you?',
    a: 'You. Conversations, briefs, and inventory belong to the partner. Your data is secure, never co-mingled, and exportable in JSON or CSV at any time.',
  },
  {
    q: 'How much branding control do we get?',
    a: 'Full theming: logo, accent palette, typography, voice, custom domain. Stella is renamed if you want — she becomes your branded AI chat.',
  },
  {
    q: 'What does inventory upload look like?',
    a: 'CSV import or read-only API connection to your existing PMS / CRM. We auto-extract concepts; you approve before they go live. Re-imports are diffed.',
  },
  {
    q: 'How heavy is the integration on our side?',
    a: 'A subdomain pilot needs zero engineering on your end. Webhook-to-CRM is 1–2 days of work. Embed is one script tag.',
  },
  {
    q: 'Which AI models do you use, and is data sent to them?',
    a: 'Reasoning: Claude Sonnet 4.6. Lighter ops: GPT-4.1-mini. Both run with strict no-training data policies. PII is redacted before model calls; raw conversation is stored on your tenant.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number>(0)

  return (
    <section id="faq">
      <div className="shell faq-grid">
        <div>
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
        <div>
          {FAQS.map((f, i) => {
            const isOpen = open === i
            const panelId = `faq-panel-${i}`
            const triggerId = `faq-trigger-${i}`
            return (
              <div key={f.q} className="faq-row">
                <button
                  id={triggerId}
                  type="button"
                  className="faq-trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{f.q}</span>
                  <span className="faq-icon">{isOpen ? <IMinus size={18} /> : <IPlus size={18} />}</span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="faq-body"
                  style={{ maxHeight: isOpen ? 240 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <p>{f.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
