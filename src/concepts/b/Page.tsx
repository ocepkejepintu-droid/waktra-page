import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import './theme.css'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/sonner'
import { NOTES, type PurposeKey } from '@/content'
import { LangProvider, useLang } from '@/shared/i18n'
import { GiveProvider, useGive } from '@/shared/give'
import { CorpBand, CountUp, EASE, Faq, Footer, GiveForm, LangButton, LegalList, PhotoSlot, SkipLink } from '@/shared/sections'
import { cn } from '@/lib/utils'
import { StageField, barRect, geometry } from './StageField'

export default function Page() {
  return (
    <LangProvider>
      <GiveProvider>
        <SkipLink />
        <Header />
        <main id="main">
          <Stage />
          <Journey />
          <Why />
          <Programs />
          <Proof />
          <Stories />
          <Give />
          <Legal />
          <Questions />
        </main>
        <Footer className="border-t border-border text-muted-foreground [&_b]:text-foreground" />
        <Toaster position="bottom-center" theme="dark" />
      </GiveProvider>
    </LangProvider>
  )
}

function Header() {
  const { t } = useLang()
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setSolid(v > innerHeight * 2.2))
  return (
    <header className={cn('fixed inset-x-0 top-0 z-40 transition-colors duration-300', solid ? 'border-b border-border bg-background/90 backdrop-blur-md' : 'bg-transparent')}>
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

/* ---------- Signature: five pillars of light become one voice ---------- */
function Stage() {
  const { t } = useLang()
  const reduce = !!useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const [stickyRef, { w, h }] = useSize<HTMLDivElement>()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const morph = useTransform(scrollYProgress, [0.12, 0.62], [0, 1], { clamp: true })

  const introO = useTransform(scrollYProgress, [0.08, 0.3], [1, 0])
  const introY = useTransform(scrollYProgress, [0.08, 0.3], [0, -40])
  const labelsO = useTransform(scrollYProgress, [0, 0.18], [1, 0])
  const quoteO = useTransform(scrollYProgress, [0.38, 0.6], [0, 1])
  const quoteY = useTransform(scrollYProgress, [0.38, 0.6], [40, 0])
  const g = geometry(w || 1, h || 1)

  return (
    <section ref={section} id="top" className="relative h-[280svh]">
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_75%_100%,rgb(250_204_88/0.1),transparent_70%)]" aria-hidden />
        <StageField progress={morph} reduce={reduce} />

        {/* pillar labels under each bar */}
        {w > 0 && (
          <motion.ul style={{ opacity: labelsO }} className="pointer-events-none absolute inset-0" aria-label={t.pillarsCap}>
            {t.pillars.map((p, i) => {
              const r = barRect(g, i)
              return (
                <li
                  key={p}
                  className="absolute -translate-x-1/2 text-center text-[0.7rem] leading-tight text-muted-foreground sm:text-xs"
                  style={{ left: r.cx, top: g.base + 14, width: Math.max(r.width + 20, 70) }}
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
          className="wrap absolute inset-x-0 bottom-0 grid pb-10 min-[900px]:top-0 min-[900px]:content-center min-[900px]:pb-0"
        >
          <div className="grid max-w-xl gap-6 min-[900px]:max-w-[44%]">
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-sm text-muted-foreground"
            >
              {t.brandSub}
            </motion.p>
            <h1 className="font-display text-[clamp(2.4rem,6.4vw,5.6rem)] leading-[0.95] font-bold tracking-[-0.03em] uppercase">
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
              className="grid gap-6"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
            >
              <p className="max-w-[46ch] text-base text-muted-foreground sm:text-lg">{t.hero.lead}</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 rounded-full px-6 text-base font-semibold">
                  <a href="#dukung">{t.hero.cta}</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full bg-transparent px-6 text-base">
                  <a href="#transparansi">{t.hero.cta2}</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* phase 2: one voice */}
        <motion.figure
          style={reduce ? undefined : { opacity: quoteO, y: quoteY }}
          className={cn('wrap absolute inset-x-0 bottom-0 grid gap-5 pb-12 sm:pb-16', reduce && 'hidden')}
          aria-hidden={reduce}
        >
          <blockquote className="max-w-[34ch] text-[clamp(1.4rem,3.2vw,2.6rem)] leading-[1.2] font-medium tracking-[-0.01em]">
            “{t.belief.text}”
          </blockquote>
          <figcaption className="grid gap-1 text-sm">
            <b>{t.belief.name}</b>
            <span className="max-w-[60ch] text-muted-foreground">{t.belief.role}</span>
          </figcaption>
        </motion.figure>
      </div>

      {/* With reduced motion the quote is shown as a normal block after the stage */}
      {reduce && (
        <figure className="wrap grid gap-5 py-20">
          <blockquote className="max-w-[34ch] text-[clamp(1.4rem,3.2vw,2.6rem)] leading-[1.2] font-medium">“{t.belief.text}”</blockquote>
          <figcaption className="grid gap-1 text-sm"><b>{t.belief.name}</b><span className="text-muted-foreground">{t.belief.role}</span></figcaption>
        </figure>
      )}
    </section>
  )
}

function H2({ children, className, spot }: { children: React.ReactNode; className?: string; spot?: string }) {
  return (
    <h2
      className={cn('spot font-display max-w-[20ch] text-[clamp(1.9rem,4.2vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]', className)}
      style={spot ? ({ ['--spot' as string]: spot } as React.CSSProperties) : undefined}
    >
      {children}
    </h2>
  )
}

function Journey() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  return (
    <section className="py-24 sm:py-32">
      <div className="wrap grid gap-14">
        <H2 spot={NOTES[4]}>{t.journey.title}</H2>
        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="absolute top-[0.6rem] right-0 left-0 hidden h-px bg-gradient-to-r from-note-1 via-note-3 to-note-5 lg:block" aria-hidden />
          {t.journey.items.map((it, i) => (
            <motion.li
              key={i}
              className="relative grid content-start gap-3"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
            >
              <span className="relative z-10 size-5 rounded-full border-4 border-background" style={{ background: NOTES[i] }} aria-hidden />
              <span className="font-display text-5xl font-semibold tracking-[-0.04em] tabular-nums">{it.yr}</span>
              <span className="text-sm font-semibold" style={{ color: NOTES[i === 2 ? 3 : i] }}>{it.dt}</span>
              <p className="text-muted-foreground">{it.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Why() {
  const { t } = useLang()
  return (
    <section className="border-y border-border bg-card py-24 sm:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-2">
        <H2 spot={NOTES[1]} className="lg:sticky lg:top-28 lg:self-start">{t.why.title}</H2>
        <div className="grid gap-12">
          {t.why.items.map((it, i) => (
            <div key={it.t} className="grid gap-3">
              <div className="h-1 w-16 rounded-full" style={{ background: NOTES[i + 1] }} aria-hidden />
              <h3 className="text-2xl font-semibold">{it.t}</h3>
              <p className="max-w-[56ch] text-lg text-muted-foreground">{it.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Programmes stack like set pieces wheeled onto the stage. */
function Programs() {
  const { t } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const n = t.uses.items.length
  return (
    <section id="program" className="py-24 sm:py-32">
      <div className="wrap grid gap-5">
        <H2 spot={NOTES[0]}>{t.uses.title}</H2>
        <p className="max-w-[58ch] text-lg text-muted-foreground">{t.uses.lead}</p>
      </div>
      <div ref={ref} className="wrap mt-14 grid gap-6">
        {t.uses.items.map((u, i) => (
          <ProgramCard key={u.key} i={i} n={n} progress={scrollYProgress} item={u} pickLabel={t.uses.pick} monthlyLabel={t.form.monthly} />
        ))}
      </div>
    </section>
  )
}

function ProgramCard({ i, n, progress, item, pickLabel, monthlyLabel }: { i: number; n: number; progress: MotionValue<number>; item: { key: string; note: number; t: string; p: string }; pickLabel: string; monthlyLabel: string }) {
  const g = useGive()
  const reduce = useReducedMotion()
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.035])
  const color = NOTES[item.note]
  return (
    <div className="sticky" style={{ top: `calc(5.5rem + ${i * 1.1}rem)` }}>
      <motion.article
        style={{ scale: reduce ? 1 : scale, transformOrigin: '50% 0%' }}
        className="grid min-h-[26rem] overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_-20px_50px_-30px_rgb(0_0_0/0.9)] md:grid-cols-[1fr_1.1fr]"
      >
        <div className="relative grid min-h-48 place-items-center overflow-hidden" style={{ background: `color-mix(in oklab, ${color} 16%, #141418)` }}>
          <div className="flex h-36 items-end gap-2.5" aria-hidden>
            {[0.55, 0.85, 1, 0.7, 0.45].map((v, k) => (
              <span key={k} className="w-5 rounded-t-md" style={{ height: `${v * 100}%`, background: color, opacity: k === 2 ? 1 : 0.35 + v * 0.3 }} />
            ))}
          </div>
        </div>
        <div className="grid content-center gap-5 p-7 sm:p-10">
          {item.key === 'kakakasuh' && (
            <Badge variant="outline" className="w-fit rounded-full border-current px-3 py-1" style={{ color }}>
              {monthlyLabel}
            </Badge>
          )}
          <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] font-semibold tracking-[-0.03em]">{item.t}</h3>
          <p className="max-w-[52ch] text-muted-foreground">{item.p}</p>
          <Button variant="outline" className="h-11 w-fit rounded-full bg-transparent px-5" onClick={() => g.pick(item.key as PurposeKey)}>
            {pickLabel} <ArrowDown />
          </Button>
        </div>
      </motion.article>
    </div>
  )
}

function Proof() {
  const { t } = useLang()
  return (
    <section id="karya" className="py-24 sm:py-32">
      <div className="wrap grid gap-16">
        <H2 spot={NOTES[3]}>{t.proof.title}</H2>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4">
          {t.proof.stats.map((s, i) => (
            <div key={s.l} className="grid content-start gap-3 bg-background p-6 sm:p-8">
              <dd className="font-display text-[clamp(2.8rem,6vw,4.8rem)] leading-none font-bold tracking-[-0.04em]" style={{ color: NOTES[i === 2 ? 4 : i] }}>
                <CountUp value={s.n} />
              </dd>
              <dt className="max-w-[24ch] text-sm text-muted-foreground">{s.l}</dt>
            </div>
          ))}
        </dl>

        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid content-start gap-5">
            <h3 className="text-2xl font-semibold">{t.proof.songsTitle}</h3>
            <ol className="grid">
              {t.songs.map(([title, by], i) => (
                <li key={title} className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-border py-4">
                  <span className="text-sm text-muted-foreground tabular-nums">{i + 1}</span>
                  <span className="text-lg font-medium transition-colors group-hover:text-primary">{title}</span>
                  <span className="text-right text-sm text-muted-foreground">{by || t.proof.byStudent}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid content-start gap-5">
            <h3 className="text-2xl font-semibold">{t.proof.groupsTitle}</h3>
            <p className="text-muted-foreground">{t.proof.groupsLead}</p>
            <ul className="flex flex-wrap gap-2">
              {t.proof.groups.map((gname, i) => (
                <li key={gname} className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm">
                  <span className="size-1.5 rounded-full" style={{ background: NOTES[i % 5] }} aria-hidden />
                  {gname}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-6">
          <h3 className="text-2xl font-semibold">{t.proof.stageTitle}</h3>
          <p className="max-w-[62ch] text-muted-foreground">{t.proof.stageText}</p>
          <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
            {t.partners.map((p, i) => (
              <li key={p} className="flex items-center gap-6 font-display text-[clamp(1.25rem,2.6vw,2.1rem)] font-semibold tracking-[-0.03em]">
                {p}
                {i < t.partners.length - 1 && <span className="size-2 rounded-full" style={{ background: NOTES[i % 5] }} aria-hidden />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Stories() {
  const { t } = useLang()
  return (
    <section className="border-t border-border py-24 sm:py-32">
      <div className="wrap grid gap-12">
        <H2 spot={NOTES[2]}>{t.stories.title}</H2>
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">{t.stories.photosTitle}</h3>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <PhotoSlot key={n} label={`${t.stories.photo} ${n}`} className="aspect-[3/4] border-border" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{t.stories.photoNote}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {t.stories.voices.map((v, i) => (
            <figure key={v.n} className="grid content-between gap-8 rounded-3xl border border-border bg-card p-7">
              <blockquote className="text-xl leading-snug text-muted-foreground">
                <span className="font-display block text-4xl leading-none" style={{ color: NOTES[i * 2] }} aria-hidden>“</span>
                {v.q}
              </blockquote>
              <figcaption className="flex items-center gap-3 text-sm">
                <PhotoSlot className="size-11 rounded-full border-border" />
                <span className="grid"><b>{v.n}</b><span className="text-muted-foreground">{v.r}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Give() {
  const { t } = useLang()
  return (
    <section id="dukung" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_30%_0%,rgb(250_204_88/0.1),transparent_70%)]" aria-hidden />
      <div className="wrap relative grid gap-12">
        <div className="grid gap-5">
          <H2>{t.form.title}</H2>
          <p className="max-w-[60ch] text-lg text-muted-foreground">{t.form.lead}</p>
        </div>
        <GiveForm />
        <CorpBand />
      </div>
    </section>
  )
}

function Legal() {
  const { t } = useLang()
  return (
    <section id="transparansi" className="border-t border-border bg-card py-24 sm:py-32">
      <div className="wrap grid gap-12">
        <div className="grid gap-5">
          <H2 spot={NOTES[4]}>{t.legal.title}</H2>
          <p className="max-w-[60ch] text-lg text-muted-foreground">{t.legal.lead}</p>
        </div>
        <LegalList className="[&_dl]:border-foreground/40" />
      </div>
    </section>
  )
}

function Questions() {
  const { t } = useLang()
  return (
    <section id="tanya" className="py-24 sm:py-32">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <H2>{t.faq.title}</H2>
        <Faq />
      </div>
    </section>
  )
}
