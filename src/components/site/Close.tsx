import { ArrowRight } from 'lucide-react'

import { Heading, Lede } from '@/components/site/Section'
import { Button } from '@/components/ui/button'
import { home } from '@/content/home'
import { DEMO_URL, SECTION } from '@/lib/links'

export function Close() {
  return (
    <section id={SECTION.close} className="scroll-mt-16 bg-band">
      <div className="shell py-20 text-center md:py-28">
        <Heading as="h2" className="mx-auto max-w-[40rem] text-ink">
          {home.close['H-9-A']}
        </Heading>
        <Lede className="mx-auto mt-5 max-w-[40rem] text-ink/80">{home.close['H-9-B']}</Lede>
        <Button asChild variant="accent" size="lg" className="mt-10">
          <a href={DEMO_URL}>
            {home.close['H-9-C']}
            <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  )
}
