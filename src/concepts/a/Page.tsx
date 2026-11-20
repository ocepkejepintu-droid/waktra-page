import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import './theme.css'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { NOTES } from '@/content'
import { LangProvider, useLang } from '@/shared/i18n'
import { GiveProvider, useGive } from '@/shared/give'
import { CorpBand, CountUp, EASE, Faq, Footer, GiveForm, LangButton, LegalList, PhotoSlot, SkipLink } from '@/shared/sections'
import { cn } from '@/lib/utils'

export default function Page() {
  return (
    <LangProvider>
      <GiveProvider>
        <SkipLink />
        <Header />
        <main id="main">
          <Hero />
          <Belief />
          <Journey />
          <Why />
          <Programs />
          <Proof />
          <Stories />
          <Give />
          <Legal />
          <Questions />
        </main>
        <Footer className="border-t border-foreground" />
        <Toaster position="bottom-center" />
      </GiveProvider>
    </LangProvider>
  )
}

function Header() {
  const { t } = useLang()
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setSolid(v > 40))
  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-[background-color,border-color] duration-300',
        solid ? 'border-b border-border bg-background/92 backdrop-blur-sm' : 'border-b border-transparent',
      )}
    >
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex items-baseline gap-2.5" aria-label="Lima Nada">
          <span className="font-display text-[1.7rem] leading-none">Lima Nada</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">{t.brandSub}</span>
        </a>
        <nav className="flex items-center gap-1" aria-label="Utama">
          <a href="#program" className="hidden rounded-md px-3 py-2 text-sm hover:bg-muted md:inline">{t.nav.programs}</a>
          <a href="#karya" className="hidden rounded-md px-3 py-2 text-sm hover:bg-muted md:inline">{t.nav.proof}</a>
          <a href="#transparansi" className="hidden rounded-md px-3 py-2 text-sm hover:bg-muted md:inline">{t.nav.legal}</a>
          <LangButton className="h-10" />
          <Button asChild className="h-10 rounded-full px-5">
            <a href="#dukung">{t.nav.give}</a>
          </Button>
        </nav>
      </div>
    </header>
  )
}

/* ---------- Signature moment: the staff draws, five notes land, scroll lifts them off ---------- */

const STAFF_Y = [70, 115, 160, 205, 250] // five lines, 45 apart
const NOTE_X = [150, 390, 630, 870, 1110]
const NOTE_Y = [227, 115, 182, 92, 160] // positions on lines and spaces: a small rising-falling phrase

function Line({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={cn('block', className)}
        initial={reduce ? false : { y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {text}
      </motion.span>
    </span>
  )
}

function Note({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion()
  // On scroll each note rises a different distance, like a chord resolving upward.
  const lift = useTransform(progress, [0, 1], [0, -(60 + i * 26)])
  const x = NOTE_X[i]
  const y = NOTE_Y[i]
  const stemUp = y > 160
  return (
    <motion.g style={{ y: reduce ? 0 : lift }}>
      <motion.g
        initial={reduce ? false : { opacity: 0, y: -90 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: EASE, delay: 1.25 + i * 0.12 }}
      >
        <ellipse cx={x} cy={y} rx="27" ry="19" transform={`rotate(-22 ${x} ${y})`} fill={NOTES[i]} />
        <line
          x1={stemUp ? x + 24 : x - 24}
          x2={stemUp ? x + 24 : x - 24}
          y1={stemUp ? y - 6 : y + 6}
          y2={stemUp ? y - 140 : y + 140}
          stroke="var(--foreground)"
          strokeWidth="3"
        />
      </motion.g>
    </motion.g>
  )
}

function Hero() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const staffStretch = useTransform(scrollYProgress, [0, 1], [1, 1.25])

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pt-8 pb-16 sm:pt-12">
      <div className="wrap grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end">
        <div>
          <p className="mb-5 text-sm text-muted-foreground">{t.hero.place}</p>
          <h1 className="font-display text-[clamp(3.4rem,10vw,8.6rem)] leading-[0.88] tracking-[-0.02em]">
            <Line text={t.hero.titleA} delay={0.1} />
            <Line text={t.hero.titleB} delay={0.22} className="pt-italic" />
          </h1>
        </div>
        <motion.div
          className="grid gap-6 lg:pb-3"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
        >
          <p className="max-w-[46ch] text-lg">{t.hero.lead}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-6 text-base">
              <a href="#dukung">{t.hero.cta}</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full bg-transparent px-6 text-base">
              <a href="#transparansi">{t.hero.cta2}</a>
            </Button>
          </div>
        </motion.div>
      </div>

      <figure className="relative mt-8 sm:mt-2">
        <motion.svg
          viewBox="0 0 1260 330"
          className="block h-auto w-full"
          style={{ scaleY: reduce ? 1 : staffStretch, transformOrigin: '50% 50%' }}
          role="img"
          aria-label={t.pillarsCap + ': ' + t.pillars.join(', ')}
        >
          {STAFF_Y.map((y, i) => (
            <motion.line
              key={y}
              x1="0"
              x2="1260"
              y1={y}
              y2={y}
              stroke="var(--foreground)"
              strokeWidth="1.5"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.35 + i * 0.07 }}
            />
          ))}
          {NOTES.map((_, i) => (
            <Note key={i} i={i} progress={scrollYProgress} />
          ))}
        </motion.svg>
        <figcaption className="wrap sm:relative sm:mx-0 sm:h-12 sm:max-w-none sm:p-0">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:contents">
            {t.pillars.map((p, i) => (
              <motion.li
                key={p}
                className="flex items-center gap-2 sm:absolute sm:top-0 sm:w-36 sm:-translate-x-1/2 sm:flex-col sm:gap-1.5 sm:text-center sm:leading-tight"
                style={{ left: (NOTE_X[i] / 1260) * 100 + '%' }}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.6 + i * 0.08 }}
              >
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: NOTES[i] }} aria-hidden />
                {p}
              </motion.li>
            ))}
          </ol>
        </figcaption>
      </figure>

    </section>
  )
}

/* Belief: the founder's words read in, word by word, as you scroll through them. */
function Belief() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = t.belief.text.split(' ')
  return (
    <section className="border-y border-foreground py-20 sm:py-28">
      <div ref={ref} className="wrap grid gap-8">
        <blockquote className="font-display max-w-[24ch] text-[clamp(2rem,4.6vw,3.9rem)] leading-[1.08] tracking-[-0.01em]">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={!!reduce}>
              {w}
            </Word>
          ))}
        </blockquote>
        <div className="grid gap-1">
          <b className="font-semibold">{t.belief.name}</b>
          <span className="max-w-[60ch] text-muted-foreground">{t.belief.role}</span>
        </div>
      </div>
    </section>
  )
}

function Word({ children, progress, range, still }: { children: string; progress: MotionValue<number>; range: [number, number]; still: boolean }) {
  const opacity = useTransform(progress, range, [0.3, 1])
  return (
    <motion.span style={{ opacity: still ? 1 : opacity }}>
      {children}{' '}
    </motion.span>
  )
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn('font-display max-w-[22ch] text-[clamp(2.3rem,5vw,4.2rem)] leading-[1] tracking-[-0.015em]', className)}>{children}</h2>
}

function Journey() {
  const { t } = useLang()
  return (
    <section className="py-20 sm:py-28">
      <div className="wrap grid gap-12">
        <SectionTitle>{t.journey.title}</SectionTitle>
        <ol className="grid border-t border-foreground sm:grid-cols-2 lg:grid-cols-4">
          {t.journey.items.map((it, i) => (
            <li key={i} className="grid content-start gap-3 border-b border-border py-6 sm:pr-8 lg:border-b-0">
              <span className="font-display text-6xl leading-none tabular-nums">{it.yr}</span>
              <span className="text-sm font-semibold text-[var(--crimson)]">{it.dt}</span>
              <p className="text-muted-foreground">{it.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Why() {
  const { t } = useLang()
  return (
    <section className="bg-muted py-20 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionTitle className="lg:sticky lg:top-28 lg:self-start">{t.why.title}</SectionTitle>
        <div className="grid">
          {t.why.items.map((it) => (
            <div key={it.t} className="grid gap-2 border-t border-foreground py-7">
              <h3 className="font-display text-3xl leading-tight">{it.t}</h3>
              <p className="max-w-[58ch] text-muted-foreground">{it.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Programs() {
  const { t } = useLang()
  const g = useGive()
  return (
    <section id="program" className="py-20 sm:py-28">
      <div className="wrap grid gap-12">
        <div className="grid gap-4">
          <SectionTitle>{t.uses.title}</SectionTitle>
          <p className="max-w-[60ch] text-lg text-muted-foreground">{t.uses.lead}</p>
        </div>
        <ul className="border-t border-foreground">
          {t.uses.items.map((u) => (
            <li
              key={u.key}
              className="pt-program grid gap-4 border-b border-foreground px-1 py-7 sm:px-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto] md:items-center md:gap-10"
              style={{ ['--note' as string]: NOTES[u.note] }}
            >
              <h3 className="font-display flex items-center gap-4 text-[clamp(1.8rem,3vw,2.6rem)] leading-tight">
                <span className="size-4 shrink-0 rounded-full" style={{ background: NOTES[u.note] }} aria-hidden />
                {u.t}
              </h3>
              <p className="max-w-[60ch] text-muted-foreground">{u.p}</p>
              <Button variant="outline" className="h-11 justify-self-start rounded-full bg-transparent px-5" onClick={() => g.pick(u.key)}>
                {t.uses.pick} <ArrowDown />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Proof() {
  const { t } = useLang()
  return (
    <section id="karya" className="bg-foreground py-20 text-background sm:py-28">
      <div className="wrap grid gap-16">
        <SectionTitle className="max-w-[20ch]">{t.proof.title}</SectionTitle>

        <dl className="grid grid-cols-2 border-t border-background/40 lg:grid-cols-4">
          {t.proof.stats.map((s) => (
            <div key={s.l} className="grid content-start gap-2 border-b border-background/25 py-6 pr-6">
              <dt className="order-2 max-w-[24ch] text-sm text-background/70">{s.l}</dt>
              <dd className="font-display order-1 text-[clamp(3.5rem,7vw,6rem)] leading-none">
                <CountUp value={s.n} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-14 lg:grid-cols-2">
          <div className="grid content-start gap-5">
            <h3 className="font-display text-3xl">{t.proof.songsTitle}</h3>
            <ol className="border-t border-background/40">
              {t.songs.map(([title, by], i) => (
                <li key={title} className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 border-b border-background/20 py-3">
                  <span className="text-sm text-background/55 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-xl">{title}</span>
                  <span className="text-right text-sm text-background/65">{by || t.proof.byStudent}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid content-start gap-5">
            <h3 className="font-display text-3xl">{t.proof.groupsTitle}</h3>
            <p className="text-background/70">{t.proof.groupsLead}</p>
            <ul className="flex flex-wrap gap-2">
              {t.proof.groups.map((gname) => (
                <li key={gname} className="rounded-full border border-background/30 px-3.5 py-1.5 text-sm">{gname}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-5 border-t border-background/40 pt-10">
          <h3 className="font-display text-3xl">{t.proof.stageTitle}</h3>
          <p className="max-w-[50ch] text-background/75">{t.proof.stageText}</p>
          <p className="font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-snug">
            {t.partners.map((p, i) => (
              <span key={p}>
                {p}
                {i < t.partners.length - 1 && <span className="pt-italic px-3 text-[var(--color-note-1)]">/</span>}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}

function Stories() {
  const { t } = useLang()
  return (
    <section className="py-20 sm:py-28">
      <div className="wrap grid gap-12">
        <SectionTitle>{t.stories.title}</SectionTitle>
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">{t.stories.photosTitle}</h3>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n, i) => (
              <PhotoSlot key={n} label={`${t.stories.photo} ${n}`} className={cn('aspect-[4/5]', i % 2 === 1 && 'lg:translate-y-10')} />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground lg:mt-12">{t.stories.photoNote}</p>
        </div>
        <div className="grid gap-10 border-t border-foreground pt-10 md:grid-cols-3">
          {t.stories.voices.map((v) => (
            <figure key={v.n} className="grid content-between gap-6">
              <blockquote className="font-display text-2xl leading-snug text-muted-foreground italic">“{v.q}”</blockquote>
              <figcaption className="flex items-center gap-3 text-sm">
                <PhotoSlot className="size-12 rounded-full" />
                <span className="grid">
                  <b>{v.n}</b>
                  <span className="text-muted-foreground">{v.r}</span>
                </span>
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
    <section id="dukung" className="border-t border-foreground bg-muted py-20 sm:py-28">
      <div className="wrap grid gap-12">
        <div className="grid gap-4">
          <SectionTitle>{t.form.title}</SectionTitle>
          <p className="max-w-[62ch] text-lg text-muted-foreground">{t.form.lead}</p>
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
    <section id="transparansi" className="py-20 sm:py-28">
      <div className="wrap grid gap-12">
        <div className="grid gap-4">
          <SectionTitle>{t.legal.title}</SectionTitle>
          <p className="max-w-[62ch] text-lg text-muted-foreground">{t.legal.lead}</p>
        </div>
        <LegalList />
      </div>
    </section>
  )
}

function Questions() {
  const { t } = useLang()
  return (
    <section id="tanya" className="pb-24">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionTitle>{t.faq.title}</SectionTitle>
        <div className="grid gap-6">
          <Faq />
          <a href="#dukung" className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-4">
            {t.hero.cta} <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
