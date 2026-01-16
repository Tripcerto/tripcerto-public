import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    const { error } = await supabase
      .from('interest_signups')
      .insert({ name, email })

    if (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
      return
    }

    setStatus('success')
    setMessage("You'll be travelling in no time! Be in touch soon!”")
    setName('')
    setEmail('')
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <main className="page">
      <section className="card">
        <div className="headline-block">
          <div className="logo">
            tripcerto<span className="logo-dot">.</span>
          </div>
          <h1 className="title">
            The <span className="accent">future of travel</span> is coming...
          </h1>
          <p className="subtitle">Be the first to join our community.</p>
        </div>
        <button className="cta" type="button" onClick={() => setIsOpen(true)}>
          Sign me up!
        </button>
        {message ? <p className={`notice ${status}`}>{message}</p> : null}
      </section>
      {isOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Register your interest</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label className="field">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>
              <label className="field">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  )
}
