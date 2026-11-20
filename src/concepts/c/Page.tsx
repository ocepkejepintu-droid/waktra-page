import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useAnimationControls, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, Volume2 } from 'lucide-react'
import './theme.css'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { NOTES, type PurposeKey } from '@/content'
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
        <Footer className="ink-light bg-[var(--navy)]" />
        <Toaster position="bottom-center" />
      </GiveProvider>
    </LangProvider>
  )
}

function Header() {
  const { t } = useLang()
  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 rounded-full bg-white/95 pr-2 pl-4 shadow-[0_10px_30px_-12px_rgb(11_61_140/0.35)] backdrop-blur">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Lima Nada">
          <svg width="28" height="24" viewBox="0 0 40 34" aria-hidden>
            {[[0, 12, 22], [8.5, 0, 34], [17, 7, 27], [25.5, 3, 31], [34, 10, 24]].map(([x, y, h], i) => (
              <rect key={i} x={x} y={y} width="6" height={h} rx="2" fill={NOTES[i]} />
            ))}
          </svg>
          <span className="font-display text-lg font-extrabold tracking-tight">LIMA NADA</span>
        </a>
        <nav className="flex items-center gap-1" aria-label="Utama">
          <a href="#program" className="hidden rounded-full px-3 py-2 text-sm hover:bg-muted md:inline">{t.nav.programs}</a>
          <a href="#karya" className="hidden rounded-full px-3 py-2 text-sm hover:bg-muted md:inline">{t.nav.proof}</a>
          <a href="#transparansi" className="hidden rounded-full px-3 py-2 text-sm hover:bg-muted md:inline">{t.nav.legal}</a>
          <LangButton className="h-10 rounded-full" />
          <Button asChild className="h-10 rounded-full px-5 font-semibold">
            <a href="#dukung">{t.nav.give}</a>
          </Button>
        </nav>
      </div>
    </header>
  )
}

/* ---------- Signature: five bars you can play — Lima Nada, five notes ---------- */

const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0] // C D E G A
const LEVELS = [0.8, 1, 0.86, 0.95, 0.82]
let audio: AudioContext | null = null

function playNote(i: number) {
  try {
    audio ??= new AudioContext()
    const now = audio.currentTime
    const o = audio.createOscillator()
    const o2 = audio.createOscillator()
    const gain = audio.createGain()
    o.type = 'triangle'
    o2.type = 'sine'
    o.frequency.value = PENTA[i]
    o2.frequency.value = PENTA[i] * 2
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.18, now + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3)
    o.connect(gain); o2.connect(gain); gain.connect(audio.destination)
    o.start(now); o2.start(now)
    o.stop(now + 1.35); o2.stop(now + 1.35)
  } catch {
    /* no audio available: the visual response still plays */
  }
}

function Bar({ i, label, playLabel }: { i: number; label: string; playLabel: string }) {
  const reduce = useReducedMotion()
  const controls = useAnimationControls()
  const play = () => {
    playNote(i)
    if (!reduce) controls.start({ scaleY: [1, 1.12, 0.94, 1.03, 1], transition: { duration: 0.7, ease: 'easeOut' } })
  }
  return (
    <motion.div
      className="flex h-full flex-1 flex-col justify-end"
      initial={reduce ? false : { y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 160, damping: 16, delay: 0.25 + i * 0.08 }}
    >
      <motion.button
        type="button"
        onClick={play}
        aria-label={`${playLabel}: ${label}`}
        animate={controls}
        whileHover={reduce ? undefined : { y: -10 }}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className="group relative flex w-full origin-bottom cursor-pointer items-end justify-center rounded-t-[1.4rem] rounded-b-md pb-4 outline-offset-4 sm:rounded-t-[2rem]"
        style={{ height: `${LEVELS[i] * 100}%`, background: NOTES[i] }}
      >
        <span
          className={cn(
            'text-[0.78rem] leading-tight font-semibold [writing-mode:vertical-rl] rotate-180 sm:text-base',
            i === 2 ? 'text-white' : 'text-[#14213D]',
          )}
        >
          {label}
        </span>
      </motion.button>
    </motion.div>
  )
}

function Hero() {
  const { t, lang } = useLang()
  const reduce = useReducedMotion()
  const word = t.hero.titleB.replace('.', '')
  const playLabel = lang === 'en' ? 'Play the note' : 'Mainkan nada'
  return (
    <section id="top" className="ink-light relative overflow-hidden bg-[var(--navy)] pt-28 pb-0 sm:pt-32">
      <div className="wrap grid items-end gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid gap-7 pb-10 lg:pb-20">
          <p className="text-sm text-[var(--muted-foreground)]">{t.brandSub}</p>
          <h1 className="font-display text-[clamp(3.2rem,9vw,7.2rem)] leading-[0.9] font-extrabold tracking-[-0.035em]">
            <motion.span
              className="block"
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {t.hero.titleA}
            </motion.span>
            <span className="block" aria-label={t.hero.titleB}>
              {[...word].map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="inline-block"
                  style={{ color: NOTES[i % 5] === NOTES[2] ? '#FF7A9C' : NOTES[i % 5] }}
                  initial={reduce ? false : { opacity: 0, y: 50, rotate: -8 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.15 + i * 0.06 }}
                >
                  {ch}
                </motion.span>
              ))}
              <span aria-hidden>.</span>
            </span>
          </h1>
          <p className="max-w-[44ch] text-lg text-[var(--muted-foreground)]">{t.hero.lead}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary" className="h-13 rounded-full px-7 text-base font-semibold">
              <a href="#dukung">{t.hero.cta}</a>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-13 rounded-full border border-white/40 px-7 text-base text-white hover:bg-white/10 hover:text-white">
              <a href="#transparansi">{t.hero.cta2}</a>
            </Button>
          </div>
        </div>
        <figure className="grid gap-3">
          <div className="flex h-[min(56svh,440px)] items-end gap-2.5 sm:gap-3.5" role="group" aria-label={t.pillarsCap}>
            {t.pillars.map((p, i) => (
              <Bar key={p} i={i} label={p} playLabel={playLabel} />
            ))}
          </div>
          <figcaption className="flex items-center justify-end gap-2 pb-4 text-sm text-[var(--muted-foreground)]">
            <Volume2 className="size-4" aria-hidden /> {lang === 'en' ? 'Five notes, five pillars. Tap one to hear it.' : 'Lima nada, lima pilar. Ketuk untuk mendengarnya.'}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

/** A colour panel that grows from an inset rounded card to full bleed as it scrolls in. */
function Panel({ color, className, children, id, ink = 'dark' }: { color: string; className?: string; children: ReactNode; id?: string; ink?: 'dark' | 'light' | 'crimson' }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] })
  const inset = useTransform(scrollYProgress, [0, 1], [5, 0])
  const radius = useTransform(scrollYProgress, [0, 1], [48, 0])
  const clip = useTransform([inset, radius], ([i, r]) => `inset(0 ${i}% round ${r}px)`)
  return (
    <section ref={ref} id={id} className={cn('relative', ink !== 'dark' && 'ink-light', ink === 'crimson' && 'on-crimson', className)}>
      <motion.div className="absolute inset-0 -z-0" style={{ background: color, clipPath: reduce ? undefined : clip }} aria-hidden />
      <div className="relative">{children}</div>
    </section>
  )
}

function H2({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('font-display max-w-[20ch] text-[clamp(2.2rem,5vw,4rem)] leading-[0.98] font-extrabold tracking-[-0.03em]', className)}>{children}</h2>
}

function Belief() {
  const { t } = useLang()
  return (
    <Panel color={NOTES[0]} className="py-20 sm:py-28">
      <div className="wrap grid gap-8">
        <blockquote className="font-display max-w-[26ch] text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[1.08] font-bold tracking-[-0.02em]">
          “{t.belief.text}”
        </blockquote>
        <div className="grid gap-1">
          <b>{t.belief.name}</b>
          <span className="max-w-[60ch] text-[#3A3320]">{t.belief.role}</span>
        </div>
      </div>
    </Panel>
  )
}

function Journey() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  return (
    <section className="py-20 sm:py-28">
      <div className="wrap grid gap-12">
        <H2>{t.journey.title}</H2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.journey.items.map((it, i) => (
            <motion.li
              key={i}
              className="grid content-start gap-3 rounded-3xl bg-muted p-6"
              initial={reduce ? false : { opacity: 0, y: 30, rotate: i % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ type: 'spring', stiffness: 140, damping: 18, delay: i * 0.08 }}
            >
              <span className="font-display text-5xl font-extrabold tracking-tight tabular-nums" style={{ color: ['#9A6D00', '#B2461A', '#A81F43', '#256B6F'][i] }}>
                {it.yr}
              </span>
              <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold">{it.dt}</span>
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
    <Panel color={NOTES[1]} className="py-20 sm:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <H2>{t.why.title}</H2>
        <ul className="grid gap-4">
          {t.why.items.map((it) => (
            <li key={it.t} className="grid gap-2 rounded-3xl bg-[#FFF3EC] p-6">
              <h3 className="font-display text-2xl font-bold tracking-tight">{it.t}</h3>
              <p className="text-[#4A3A33]">{it.p}</p>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}

function Tile({ item, big, pickLabel }: { item: { key: PurposeKey; note: number; t: string; p: string }; big?: boolean; pickLabel: string }) {
  const g = useGive()
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<CSSProperties>({})
  const dark = item.note === 2
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current!.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    setStyle({ ['--rx' as string]: `${-y * 6}deg`, ['--ry' as string]: `${x * 8}deg` })
  }
  return (
    <div ref={ref} className={cn('tile', big && 'md:col-span-2 md:row-span-2')} onPointerMove={onMove} onPointerLeave={() => setStyle({})}>
      <article
        className={cn('tile-face grid h-full content-between gap-8 rounded-[2rem] p-7 sm:p-8', dark ? 'text-white' : 'text-[#14213D]')}
        style={{ ...style, background: NOTES[item.note] }}
      >
        <div className="grid gap-3">
          <h3 className={cn('font-display leading-[1] font-extrabold tracking-[-0.03em]', big ? 'text-[clamp(2.2rem,4.5vw,3.6rem)]' : 'text-[1.7rem]')}>{item.t}</h3>
          <p className={cn(big ? 'max-w-[42ch] text-lg' : 'text-[0.95rem]', dark ? 'text-[#FBE3EA]' : 'text-[#14213D]')}>{item.p}</p>
        </div>
        <Button
          onClick={() => g.pick(item.key)}
          className={cn('h-11 w-fit rounded-full px-5 font-semibold', dark ? 'bg-white text-[#7A1230] hover:bg-white/90' : 'bg-[#14213D] text-white hover:bg-[#14213D]/90')}
        >
          {pickLabel} <ArrowDown />
        </Button>
      </article>
    </div>
  )
}

function Programs() {
  const { t } = useLang()
  const [first, ...rest] = t.uses.items
  return (
    <section id="program" className="py-20 sm:py-28">
      <div className="wrap grid gap-12">
        <div className="grid gap-4">
          <H2>{t.uses.title}</H2>
          <p className="max-w-[58ch] text-lg text-muted-foreground">{t.uses.lead}</p>
        </div>
        <div className="grid auto-rows-[minmax(17rem,auto)] gap-4 md:grid-cols-4">
          <Tile item={first} big pickLabel={t.uses.pick} />
          {rest.map((u) => (
            <Tile key={u.key} item={u} pickLabel={t.uses.pick} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Proof() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  return (
    <Panel id="karya" color={NOTES[2]} ink="crimson" className="py-20 sm:py-28">
      <div className="wrap grid gap-14">
        <H2>{t.proof.title}</H2>
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {t.proof.stats.map((s, i) => (
            <motion.div
              key={s.l}
              className="grid content-start gap-2 rounded-[2rem] bg-white p-6 text-[#14213D]"
              initial={reduce ? false : { scale: 0.85, opacity: 0, rotate: i % 2 ? 3 : -3 }}
              whileInView={{ scale: 1, opacity: 1, rotate: i % 2 ? 1.5 : -1.5 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: i * 0.07 }}
            >
              <dd className="font-display text-[clamp(3rem,6vw,4.8rem)] leading-none font-extrabold tracking-[-0.04em] text-[#9E1C40]">
                <CountUp value={s.n} />
              </dd>
              <dt className="max-w-[24ch] text-sm text-[#4A5772]">{s.l}</dt>
            </motion.div>
          ))}
        </dl>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="grid content-start gap-4">
            <h3 className="font-display text-3xl font-bold">{t.proof.songsTitle}</h3>
            <ul className="flex flex-wrap gap-2.5">
              {t.songs.map(([title, by], i) => (
                <li key={title} className="rounded-full px-4 py-2 text-[#14213D]" style={{ background: NOTES[[0, 1, 3, 4][i % 4]] }}>
                  <b className="font-semibold">{title}</b> <span className="text-sm opacity-75">· {by || t.proof.byStudent}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid content-start gap-4">
            <h3 className="font-display text-3xl font-bold">{t.proof.groupsTitle}</h3>
            <p className="text-[var(--muted-foreground)]">{t.proof.groupsLead}</p>
            <ul className="flex flex-wrap gap-2">
              {t.proof.groups.map((gname) => (
                <li key={gname} className="rounded-full border border-white/45 px-3.5 py-1.5 text-sm">{gname}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid gap-4 rounded-[2rem] bg-[#8F1A3A] p-7 sm:p-9">
          <h3 className="font-display text-3xl font-bold">{t.proof.stageTitle}</h3>
          <p className="max-w-[62ch] text-[var(--muted-foreground)]">{t.proof.stageText}</p>
          <ul className="flex flex-wrap gap-2">
            {t.partners.map((p) => (
              <li key={p} className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#14213D]">{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  )
}

function Stories() {
  const { t } = useLang()
  return (
    <section className="py-20 sm:py-28">
      <div className="wrap grid gap-12">
        <H2>{t.stories.title}</H2>
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">{t.stories.photosTitle}</h3>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n, i) => (
              <PhotoSlot key={n} label={`${t.stories.photo} ${n}`} className={cn('aspect-[4/5] rounded-[2rem]', i % 2 ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]')} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{t.stories.photoNote}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {t.stories.voices.map((v, i) => (
            <figure key={v.n} className="grid content-between gap-8 rounded-[2rem] p-7 text-[#14213D]" style={{ background: NOTES[[3, 4, 0][i]] }}>
              <blockquote className="font-display text-2xl leading-snug font-semibold">“{v.q}”</blockquote>
              <figcaption className="flex items-center gap-3 text-sm">
                <PhotoSlot className="size-12 rounded-full" />
                <span className="grid"><b>{v.n}</b><span className="opacity-75">{v.r}</span></span>
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
    <Panel id="dukung" color="#E8EEF9" className="py-20 sm:py-28">
      <div className="wrap grid gap-12">
        <div className="grid gap-4">
          <H2>{t.form.title}</H2>
          <p className="max-w-[60ch] text-lg text-muted-foreground">{t.form.lead}</p>
        </div>
        <GiveForm />
        <CorpBand className="rounded-[2rem]" />
      </div>
    </Panel>
  )
}

function Legal() {
  const { t } = useLang()
  return (
    <section id="transparansi" className="py-20 sm:py-28">
      <div className="wrap grid gap-12">
        <div className="grid gap-4">
          <H2>{t.legal.title}</H2>
          <p className="max-w-[60ch] text-lg text-muted-foreground">{t.legal.lead}</p>
        </div>
        <LegalList />
      </div>
    </section>
  )
}

function Questions() {
  const { t } = useLang()
  return (
    <Panel color={NOTES[4]} className="py-20 sm:py-28">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <H2>{t.faq.title}</H2>
        <Faq className="rounded-[2rem] bg-white px-6 sm:px-8" />
      </div>
    </Panel>
  )
}
