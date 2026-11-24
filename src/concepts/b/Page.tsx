import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, Check, GraduationCap, Hand, MicVocal, Piano, ShieldCheck } from 'lucide-react'
import './theme.css'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/sonner'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { NOTES, type PurposeKey } from '@/content'
import { LangProvider, useLang } from '@/shared/i18n'
import { GiveProvider, useGive } from '@/shared/give'
import { CorpBand, CountUp, EASE, Faq, Footer, GiveForm, LangButton, LegalList, SkipLink } from '@/shared/sections'
import { cn } from '@/lib/utils'
import { StageField, barRect, geometry } from './StageField'

/*
 * Simplified after the three audits: six sections, the ask early and repeated,
 * trust beside the money. Stories and the Journey timeline return once real
 * consented photos and testimonials exist.
 */
export default function Page() {
  return (
    <LangProvider>
      <GiveProvider>
        <SkipLink />
        <Header />
        <main id="main">
          <Stage />
          <Why />
          <Programs />
          <Proof />
          <Give />
          <Questions />
        </main>
        <Footer className="border-t border-border pb-28 text-muted-foreground md:pb-14 [&_b]:text-foreground" />
        <StickyAsk />
        <Toaster position="top-center" theme="dark" />
      </GiveProvider>
    </LangProvider>
  )
}

function Header() {
  const { t } = useLang()
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setSolid(v > innerHeight * 0.3))
  return (
    <header className={cn('fixed inset-x-0 top-0 z-40 transition-colors duration-300', solid ? 'border-b border-border bg-background/92 backdrop-blur-md' : 'bg-transparent')}>
      <div className="wrap flex h-16 items-center justify-between gap-3">
        <a href="#top" className="flex items-center gap-3" aria-label="Lima Nada">
          <Mark />
          <span className="font-display text-sm font-semibold tracking-[0.12em] uppercase">Lima Nada</span>
        </a>
        <nav className="flex items-center gap-1" aria-label="Utama">
          <a href="#program" className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground md:inline">{t.nav.programs}</a>
          <a href="#karya" className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground md:inline">{t.nav.proof}</a>
          <a href="#transparansi" className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground md:inline">{t.nav.legal}</a>
          <LangButton className="h-10 text-muted-foreground" />
          <Button asChild className="h-10 rounded-full px-5 font-semibold">
            <a href="#dukung">{t.nav.give}</a>
          </Button>
        </nav>
      </div>
    </header>
  )
}

function Mark() {
  return (
    <svg width="26" height="22" viewBox="0 0 40 34" aria-hidden>
      {[[0, 12, 22], [8.5, 0, 34], [17, 7, 27], [25.5, 3, 31], [34, 10, 24]].map(([x, y, h], i) => (
        <rect key={i} x={x} y={y} width="6" height={h} rx="2" fill={NOTES[i]} />
      ))}
    </svg>
  )
}

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = ref.current!
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

function AskButtons({ className }: { className?: string }) {
  const { t } = useLang()
  const g = useGive()
  return (
    <div className={cn('grid gap-4', className)}>
      <div className="flex flex-wrap gap-3">
        <Button size="lg" className="h-12 rounded-full px-6 text-base font-semibold" onClick={() => g.pick('kakakasuh')}>
          {t.simple.heroCta}
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 rounded-full bg-transparent px-6 text-base">
          <a href="#transparansi">{t.simple.heroCta2}</a>
        </Button>
      </div>
      <p className="flex max-w-[52ch] items-start gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        {t.simple.trust}
      </p>
    </div>
  )
}

/* ---------- Signature: five pillars of light become one voice (shortened) ---------- */
function Stage() {
  const { t } = useLang()
  const reduce = !!useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const [stickyRef, { w, h }] = useSize<HTMLDivElement>()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const morph = useTransform(scrollYProgress, [0.08, 0.55], [0, 1], { clamp: true })
  const introO = useTransform(scrollYProgress, [0.04, 0.26], [1, 0])
  const introY = useTransform(scrollYProgress, [0.04, 0.26], [0, -30])
  const labelsO = useTransform(scrollYProgress, [0, 0.14], [1, 0])
  const quoteO = useTransform(scrollYProgress, [0.32, 0.56], [0, 1])
  const quoteY = useTransform(scrollYProgress, [0.32, 0.56], [30, 0])
  const g = geometry(w || 1, h || 1)
  const quote = (
    <>
      <blockquote className="max-w-[34ch] text-[clamp(1.25rem,2.8vw,2.3rem)] leading-[1.22] font-medium tracking-[-0.01em]">
        “{t.belief.text}”
      </blockquote>
      <p className="text-sm"><b>{t.belief.name}</b><span className="text-muted-foreground"> · {t.belief.role}</span></p>
      <AskButtons className="mt-2" />
    </>
  )

  return (
    <section ref={section} id="top" className={cn('relative', !reduce && 'h-[170svh]')}>
      <div ref={stickyRef} className={cn('top-0 h-svh min-h-[36rem] overflow-hidden', reduce ? 'relative' : 'sticky')}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_75%_100%,rgb(250_176_88/0.14),transparent_70%)]" aria-hidden />
        <StageField progress={morph} reduce={reduce} />

        {w > 0 && (
          <motion.ul style={{ opacity: labelsO }} className="pointer-events-none absolute inset-0" aria-label={t.pillarsCap}>
            {t.pillars.map((p, i) => {
              const r = barRect(g, i)
              return (
                <li
                  key={p}
                  className="absolute -translate-x-1/2 text-center text-[0.75rem] leading-tight text-muted-foreground sm:text-xs"
                  style={{ left: r.cx, top: g.base + 12, width: Math.max(r.width + 20, 72) }}
                >
                  {p}
                </li>
              )
            })}
          </motion.ul>
        )}

        {/* phase 1: the offer */}
        <motion.div
          style={reduce ? undefined : { opacity: introO, y: introY }}
          className="wrap absolute inset-x-0 bottom-0 grid pb-8 min-[900px]:top-0 min-[900px]:content-center min-[900px]:pb-0"
        >
          <div className="grid max-w-xl gap-5 min-[900px]:max-w-[44%]">
            <h1 className="font-display text-[clamp(2.3rem,6.2vw,5.4rem)] leading-[0.95] font-bold tracking-[-0.03em] uppercase">
              {[t.hero.titleA, t.hero.titleB].map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className={cn('block', i === 1 && 'text-primary')}
                    initial={reduce ? false : { y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: EASE, delay: 0.15 + i * 0.12 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div
              className="grid gap-5"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
            >
              <p className="hidden max-w-[44ch] text-lg text-muted-foreground sm:block">{t.hero.lead}</p>
              <AskButtons />
            </motion.div>
          </div>
        </motion.div>

        {/* phase 2: one voice, and the ask again */}
        {!reduce && (
          <motion.figure
            style={{ opacity: quoteO, y: quoteY }}
            className="wrap absolute inset-x-0 top-[30%] grid gap-4 min-[900px]:top-auto min-[900px]:bottom-0 min-[900px]:pb-14"
          >
            {quote}
          </motion.figure>
        )}
      </div>

      {/* Reduced motion: no pinning, the quote simply follows the stage */}
      {reduce && <figure className="wrap grid gap-4 py-16">{quote}</figure>}
    </section>
  )
}

function H2({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn('font-display max-w-[20ch] text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.03em]', className)}>{children}</h2>
}

function Why() {
  const { t } = useLang()
  return (
    <section className="border-y border-border bg-card py-16 sm:py-20">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <H2>{t.simple.whyTitle}</H2>
        <ul className="grid gap-6">
          {t.simple.why.map((line, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr] items-start gap-4 text-lg">
              <span className="mt-2.5 size-2.5 rounded-full" style={{ background: NOTES[i + 1] }} aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const OTHER_ICONS: Partial<Record<PurposeKey, typeof Hand>> = { pembinaan: GraduationCap, swararaba: Hand, panggung: MicVocal, sarana: Piano }

function Programs() {
  const { t } = useLang()
  const g = useGive()
  const others = t.uses.items.filter((u) => u.key !== 'kakakasuh')
  return (
    <section id="program" className="stagelight py-20 sm:py-28">
      <div className="wrap grid gap-14">
        <article className="grid overflow-hidden rounded-[1.75rem] border border-primary/30 bg-card md:grid-cols-[1.15fr_0.85fr]">
          <div className="grid content-center gap-6 p-7 sm:p-10">
            <Badge variant="outline" className="w-fit rounded-full border-primary/50 px-3 py-1 text-primary">{t.form.monthly}</Badge>
            <H2 className="max-w-[16ch]">{t.simple.offerTitle}</H2>
            <p className="max-w-[48ch] text-lg text-muted-foreground">{t.simple.offerLead}</p>
            <ul className="grid gap-3">
              {t.simple.offerPoints.map((pt) => (
                <li key={pt} className="flex items-center gap-3">
                  <Check className="size-5 shrink-0 text-primary" aria-hidden />
                  {pt}
                </li>
              ))}
            </ul>
            <Button size="lg" className="h-12 w-fit rounded-full px-6 text-base font-semibold" onClick={() => g.pick('kakakasuh')}>
              {t.simple.heroCta} <ArrowDown />
            </Button>
          </div>
          <div className="relative hidden min-h-64 place-items-center bg-[radial-gradient(70%_70%_at_50%_100%,rgb(245_138_90/0.28),transparent_75%)] md:grid" aria-hidden>
            <div className="flex h-44 items-end gap-3">
              {[0.8, 1, 0.86, 0.95, 0.82].map((v, k) => (
                <span key={k} className="w-7 rounded-t-lg" style={{ height: `${v * 100}%`, background: NOTES[k] }} />
              ))}
            </div>
          </div>
        </article>

        <div className="grid gap-6">
          <h3 className="text-xl font-semibold">{t.simple.otherTitle}</h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((u) => {
              const Icon = OTHER_ICONS[u.key] ?? Hand
              return (
                <li key={u.key} className="grid content-between gap-5 rounded-2xl border border-border bg-card p-6">
                  <div className="grid gap-3">
                    <span className="grid size-11 place-items-center rounded-full" style={{ background: `color-mix(in oklab, ${NOTES[u.note]} 22%, transparent)`, color: NOTES[u.note] }}>
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h4 className="text-lg leading-snug font-semibold">{u.t}</h4>
                    <p className="text-sm text-muted-foreground">{u.p}</p>
                  </div>
                  <Button variant="outline" className="h-11 w-fit rounded-full bg-transparent px-4" onClick={() => g.pick(u.key)}>
                    {t.uses.pick} <ArrowDown />
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Proof() {
  const { t } = useLang()
  const stats = t.proof.stats.slice(0, 3)
  return (
    <section id="karya" className="border-t border-border py-20 sm:py-28">
      <div className="wrap grid gap-12">
        <div className="grid gap-4">
          <H2>{t.proof.title}</H2>
          <p className="max-w-[60ch] text-muted-foreground">{t.simple.since}</p>
        </div>
        <dl className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
          {stats.map((s, i) => (
            <div key={s.l} className="grid content-start gap-2 bg-background p-6 sm:p-8">
              <dd className="font-display text-[clamp(3rem,6vw,4.6rem)] leading-none font-bold tracking-[-0.04em]" style={{ color: NOTES[[0, 1, 4][i]] }}>
                <CountUp value={s.n} />
              </dd>
              <dt className="max-w-[26ch] text-muted-foreground">{s.l}</dt>
            </div>
          ))}
        </dl>
        <Accordion type="single" collapsible>
          <AccordionItem value="more">
            <AccordionTrigger className="py-5 text-left text-base font-semibold">{t.simple.moreDetail}</AccordionTrigger>
            <AccordionContent className="grid gap-10 pb-6 md:grid-cols-2">
              <div className="grid content-start gap-3">
                <p className="text-muted-foreground">{t.simple.songsSummary}</p>
                <ol className="grid">
                  {t.songs.map(([title, by]) => (
                    <li key={title} className="flex justify-between gap-4 border-b border-border py-2.5">
                      <span className="font-medium">{title}</span>
                      <span className="text-right text-sm text-muted-foreground">{by || t.proof.byStudent}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="grid content-start gap-3">
                <p className="text-muted-foreground">{t.proof.groupsLead}</p>
                <ul className="grid">
                  {t.proof.groups.map((gname) => (
                    <li key={gname} className="border-b border-border py-2.5">{gname}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="grid gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground">{t.proof.stageTitle}</h3>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-lg font-medium">
            {t.partners.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Give() {
  const { t } = useLang()
  return (
    <section id="dukung" className="stagelight border-t border-border py-20 sm:py-28">
      <div className="wrap grid gap-12">
        <div className="grid gap-4">
          <H2>{t.simple.giveTitle}</H2>
          <p className="max-w-[58ch] text-lg text-muted-foreground">{t.form.lead}</p>
        </div>
        <GiveForm />
        <div id="transparansi" className="grid gap-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="grid gap-2">
            <h3 className="flex items-center gap-2 text-xl font-semibold"><ShieldCheck className="size-5 text-primary" aria-hidden />{t.legal.title}</h3>
            <p className="max-w-[60ch] text-muted-foreground">{t.simple.trust}</p>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="legal" className="border-b-0">
              <AccordionTrigger className="py-3 text-left text-base font-semibold">{t.simple.legalFull}</AccordionTrigger>
              <AccordionContent className="pt-4">
                <LegalList className="[&_dl]:border-foreground/40" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <CorpBand />
      </div>
    </section>
  )
}

function Questions() {
  const { t } = useLang()
  return (
    <section id="tanya" className="border-t border-border py-20 sm:py-28">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <H2>{t.faq.title}</H2>
        <Faq />
      </div>
    </section>
  )
}

/** Phone-only: one tap to the Kakak Asuh form from anywhere after the hero, hidden once the form is on screen. */
function StickyAsk() {
  const { t } = useLang()
  const g = useGive()
  const { scrollY } = useScroll()
  const [past, setPast] = useState(false)
  const [atForm, setAtForm] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setPast(v > innerHeight * 1.2))
  useEffect(() => {
    const el = document.getElementById('dukung')
    if (!el) return
    const io = new IntersectionObserver(([en]) => setAtForm(en.isIntersecting), { rootMargin: '0px 0px -30% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const show = past && !atForm
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-3 backdrop-blur-md transition-transform duration-300 md:hidden',
        show ? 'translate-y-0' : 'pointer-events-none translate-y-full',
      )}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
      aria-hidden={!show}
    >
      <Button className="h-12 w-full rounded-full text-base font-semibold" tabIndex={show ? 0 : -1} onClick={() => g.pick('kakakasuh')}>
        {t.simple.sticky}
      </Button>
    </div>
  )
}
