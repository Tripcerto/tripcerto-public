import type { LucideIcon } from 'lucide-react'
import { BookOpenCheck, Check, Globe, MessageSquareText, Package, SlidersHorizontal, UserRound, Workflow } from 'lucide-react'
import { Close } from '@/components/site/Close'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { Heading, Lede, Section } from '@/components/site/Section'
import { Stage } from '@/components/site/Stage'
import { BriefCard } from '@/components/site/frames/BriefCard'
import { PhoneScreen } from '@/components/site/frames/PhoneScreen'
import { delay } from '@/components/site/frames/motion'
import { engage } from '@/content/engage'
import { usePageAnalytics } from '@/lib/analytics'
import { DEMO_URL, PAGES } from '@/lib/links'

const ID = {
  travellers: 'what-travellers-get',
  sales: 'what-reaches-sales',
  business: 'how-it-works',
  boundaries: 'what-stays',
} as const

type Column = (typeof engage.travellers.columns)[number]['name']
type Row = (typeof engage.business.rows)[number]['name']

const COLUMN_GLYPH: Record<Column, LucideIcon> = {
  'In their own words': MessageSquareText,
  'From your expertise': BookOpenCheck,
  'A person when they want one': UserRound,
}

const ROW_GLYPH: Record<Row, LucideIcon> = {
  'Your content and products': Package,
  'Your website': Globe,
  'Your sales process': Workflow,
  'Your controls': SlidersHorizontal,
}

/* The Engage page: the opening on the band with the phone, what travellers
   get as three ruled columns, the brief that reaches sales beside its
   frame, how the business uses it as ruled rows, what stays where it is,
   and the close. The home page's idioms throughout. */
export function EngagePage() {
  usePageAnalytics()
  return (
    <>
      <Nav />
      <main>
        <PageHero
          title={engage.hero['E-1-A']}
          lede={engage.hero['E-1-B']}
          primary={{ label: engage.hero['E-1-C'], href: DEMO_URL }}
          secondary={{ label: engage.hero['E-1-D'], href: `#${ID.travellers}` }}
          visual={
            <div className="animate-float w-[min(60%,280px)]" style={delay(1.6)}>
              <PhoneScreen />
            </div>
          }
        />

        <Section id={ID.travellers}>
          <div className="max-w-[44rem]">
            <Heading>{engage.travellers['E-3-A']}</Heading>
            <Lede className="mt-5">{engage.travellers['E-3-B']}</Lede>
          </div>
          <ul role="list" className="mt-14 grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-10 xl:gap-x-14">
            {engage.travellers.columns.map(({ name, line }) => {
              const Glyph = COLUMN_GLYPH[name]
              return (
                <li key={name} className="border-t border-line pt-6">
                  <h3 className="flex items-center gap-2.5 text-[19px] font-semibold">
                    <Glyph size={22} aria-hidden className="shrink-0 text-link" />
                    {name}
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.55] text-body/80">{line}</p>
                </li>
              )
            })}
          </ul>
        </Section>

        <Section id={ID.sales} tone="tint" className="py-16 md:py-28">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[6fr_5fr] lg:gap-16">
            <div>
              <Heading>{engage.sales['E-4-A']}</Heading>
              <Lede className="mt-5 max-w-[40rem]">{engage.sales['E-4-B']}</Lede>
              <ul role="list" className="mt-8 space-y-3">
                {engage.sales.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-base text-body">
                    <Check size={18} aria-hidden className="mt-[3px] shrink-0 text-link" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Stage caption={engage.sales.caption} className="max-lg:mb-8">
              <Reveal className="w-full max-w-[400px]">
                <BriefCard />
              </Reveal>
            </Stage>
          </div>
        </Section>

        <Section id={ID.business}>
          <div className="max-w-[44rem]">
            <Heading>{engage.business['E-5-A']}</Heading>
            <Lede className="mt-5">{engage.business['E-5-B']}</Lede>
          </div>
          <ul role="list" className="mt-12 divide-y divide-line md:mt-14">
            {engage.business.rows.map(({ name, detail, line }) => {
              const Glyph = ROW_GLYPH[name]
              return (
                <li key={name} className="grid grid-cols-1 gap-2 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-x-12 md:gap-y-0">
                  <div className="flex items-start gap-3">
                    <Glyph size={22} aria-hidden className="mt-px shrink-0 text-link" />
                    <div>
                      <h3 className="text-[17px] leading-[1.4] font-semibold">{name}</h3>
                      <p className="mt-1 text-[14px] leading-[1.5] text-dim">{detail}</p>
                    </div>
                  </div>
                  <p className="pl-[34px] text-[16px] leading-[1.55] text-body/80 md:pl-0">{line}</p>
                </li>
              )
            })}
          </ul>
        </Section>

        <Section id={ID.boundaries} tone="tint">
          <div className="max-w-[44rem]">
            <Heading>{engage.boundaries['E-7-A']}</Heading>
            <Lede className="mt-5">{engage.boundaries['E-7-B']}</Lede>
          </div>
        </Section>

        <Close
          heading={engage.close['E-9-A']}
          line={engage.close['E-9-B']}
          primary={{ label: engage.close['E-10-B'], href: DEMO_URL }}
          secondary={{ label: engage.close['E-10-C'], href: PAGES.pilot }}
        />
      </main>
      <Footer />
    </>
  )
}
