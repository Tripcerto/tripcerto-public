import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { usePageAnalytics } from '@/lib/analytics'

/* A legal document inside the site's nav and footer. The document is our
   own HTML file from src/content/legal, set as written. */
export function LegalPage({ html }: { html: string }) {
  usePageAnalytics()
  return (
    <>
      <Nav />
      <main className="shell pt-28 pb-20 md:pt-36 md:pb-28">
        <article className="legal" dangerouslySetInnerHTML={{ __html: html }} />
      </main>
      <Footer />
    </>
  )
}
