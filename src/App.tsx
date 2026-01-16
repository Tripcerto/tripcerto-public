import { useState, type FormEvent } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

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
    setMessage("Thanks! We'll be in touch.")
    setName('')
    setEmail('')
  }

  return (
    <main className="page">
      <section className="card">
        <div className="logo">
          tripcerto<span className="logo-dot">.</span>
        </div>
        <h1>The future of travel is coming...</h1>
        <p className="subtitle">
          Be the first to join our community
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            Name
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
            Email
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting...' : 'Notify me'}
          </button>
        </form>
        {message ? <p className={`notice ${status}`}>{message}</p> : null}
      </section>
    </main>
  )
}
