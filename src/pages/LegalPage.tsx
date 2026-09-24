import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { HERO_PAD } from '@/components/site/Section'
import { cn } from '@/lib/utils'

/* A legal document inside the site's nav and footer, opening as far under
   the bar as every page's hero does. The document is our own HTML file from
   src/content/legal, set as written. */
export function LegalPage({ html }: { html: string }) {
  return (
    <>
      <Nav opensOnBand={false} />
      <main className={cn('shell', HERO_PAD)}>
        <article className="legal" dangerouslySetInnerHTML={{ __html: html }} />
      </main>
      <Footer />
    </>
  )
}
