import { LegalPage } from '@/pages/LegalPage'
import html from '@/content/legal/terms.html?raw'

export function TermsPage() {
  return <LegalPage html={html} />
}
