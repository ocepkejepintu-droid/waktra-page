import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { toast } from 'sonner'
import { Copy, MessageCircle, ShieldCheck, Receipt, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ACCOUNT, EMAIL, INSTAGRAM, WA_DISPLAY, type PurposeKey } from '@/content'
import { useLang } from './i18n'
import { fmt, useGive } from './give'

export const EASE = [0.16, 1, 0.3, 1] as const

/** Number that glides to its new value instead of jumping (tabular, so width stays put). */
export function RollingNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      el.textContent = format(value)
      prev.current = value
      return
    }
    const c = animate(prev.current, value, {
      duration: 0.5,
      ease: EASE,
      onUpdate: (v) => (el.textContent = format(Math.round(v))),
    })
    prev.current = value
    return () => c.stop()
  }, [value, format, reduce])
  return <span ref={ref} className="tabular-nums">{format(value)}</span>
}

/** Counts up once when scrolled into view. Non-numeric values render as-is. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduce = useReducedMotion()
  const n = Number(value)
  useEffect(() => {
    if (!inView || reduce || Number.isNaN(n) || !ref.current) return
    const el = ref.current
    const c = animate(0, n, { duration: 1.2, ease: EASE, onUpdate: (v) => (el.textContent = String(Math.round(v))) })
    return () => c.stop()
  }, [inView, reduce, n])
  return <span ref={ref} className={cn('tabular-nums', className)}>{value}</span>
}

export function LangButton({ className }: { className?: string }) {
  const { t, lang, toggle } = useLang()
  return (
    <Button variant="ghost" size="sm" className={className} onClick={toggle} lang={lang === 'en' ? 'id' : 'en'}>
      {t.langSwitch}
    </Button>
  )
}

export function SkipLink() {
  const { t } = useLang()
  return (
    <a href="#main" className="sr-only z-50 rounded-md bg-background px-4 py-2 text-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
      {t.skip}
    </a>
  )
}

async function copyText(text: string, ok: string, fail: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(ok, { description: text })
  } catch {
    toast.error(fail + ' ' + text)
  }
}

const PURPOSE_KEYS: PurposeKey[] = ['umum', 'kakakasuh', 'pembinaan', 'swararaba', 'panggung', 'sarana']

/** The working donation form + transfer slip. Layout and skin come from the concept's tokens. */
export function GiveForm({ className }: { className?: string }) {
  const { t, lang } = useLang()
  const g = useGive()
  const f = t.form
  const [raw, setRaw] = useState('')
  useEffect(() => setRaw(g.amount ? fmt(g.amount, lang) : ''), [g.amount, lang])

  const onAmount = (v: string) => {
    const d = v.replace(/\D/g, '').replace(/^0+/, '').slice(0, 13)
    g.setAmount(d ? parseInt(d, 10) : 0)
    setRaw(d ? fmt(parseInt(d, 10), lang) : '')
  }

  return (
    <div className={cn('grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]', className)}>
      <Card className="give-card">
        <CardContent className="grid grid-cols-[minmax(0,1fr)] gap-7 p-6 sm:p-8">
          <div className="grid gap-3">
            <Label htmlFor="purpose" className="text-base">{f.purpose}</Label>
            <Select value={g.purpose} onValueChange={(v) => g.setPurpose(v as PurposeKey)}>
              <SelectTrigger id="purpose" className="w-full min-w-0 text-base data-[size=default]:h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PURPOSE_KEYS.map((k) => (
                  <SelectItem key={k} value={k} className="py-2.5 text-base">{t.purposes[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label className="text-base">{f.freq}</Label>
            <ToggleGroup
              type="single"
              variant="outline"
              spacing={0}
              value={g.monthly ? 'monthly' : 'once'}
              onValueChange={(v) => v && g.setMonthly(v === 'monthly')}
              className="w-full"
            >
              <ToggleGroupItem value="monthly" className="h-12 flex-1 text-base">{f.monthly}</ToggleGroupItem>
              <ToggleGroupItem value="once" disabled={g.purpose === 'kakakasuh'} className="h-12 flex-1 text-base">{f.once}</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="amount" className="text-base">{f.amount}</Label>
            <div className="money flex items-center rounded-xl border-2 border-input bg-background transition-colors focus-within:border-primary">
              <span className="pr-1 pl-4 text-lg font-semibold text-muted-foreground" aria-hidden>Rp</span>
              <input
                id="amount"
                inputMode="numeric"
                autoComplete="off"
                placeholder="0"
                value={raw}
                onChange={(e) => onAmount(e.target.value)}
                aria-describedby="amountWords amountHint"
                className="font-display w-0 min-w-0 flex-1 bg-transparent py-3 pr-3 text-3xl tabular-nums outline-none placeholder:font-sans placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {f.presets.map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant={g.amount === p ? 'default' : 'outline'}
                  size="sm"
                  className="h-11 rounded-full px-4 tabular-nums"
                  onClick={() => g.setAmount(p)}
                  aria-pressed={g.amount === p}
                >
                  {p >= 1e6 ? fmt(p / 1e6, lang) + (lang === 'en' ? 'm' : ' jt') : fmt(p / 1000, lang) + (lang === 'en' ? 'k' : 'rb')}
                </Button>
              ))}
            </div>
            <p id="amountWords" aria-live="polite" className="min-h-[1.5em] text-sm text-muted-foreground italic">{g.words}</p>
            <p id="amountHint" className="text-sm text-muted-foreground">{f.amountHint}</p>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="donorName" className="text-base">{f.name}</Label>
            <Input id="donorName" autoComplete="name" placeholder={f.namePh} value={g.name} onChange={(e) => g.setName(e.target.value)} className="h-12 text-base" />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox id="paid" checked={g.paid} onCheckedChange={(v) => g.setPaid(v === true)} className="mt-1 size-5" />
            <Label htmlFor="paid" className="grid gap-1 text-base leading-snug font-medium">
              {f.paid}
              <span className="text-sm font-normal text-muted-foreground">{f.paidHint}</span>
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card className="slip lg:sticky lg:top-24">
        <CardContent className="grid gap-7 p-6 sm:p-8">
          <h3 className="font-display text-2xl">{f.stepsTitle}</h3>

          <Step n={1} title={f.st1}>
            <div className="grid gap-3 border-y-2 border-dashed border-border py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs tracking-wide text-muted-foreground uppercase">Bank Mandiri</div>
                  <div className="font-display text-2xl tracking-wide tabular-nums">{ACCOUNT}</div>
                </div>
                <Button size="sm" className="h-10" onClick={() => copyText(ACCOUNT, f.copiedAcct, f.copyFail)}>
                  <Copy /> {f.copyAcct}
                </Button>
              </div>
              <div className="grid gap-0.5">
                <div className="text-sm font-semibold">{f.holder}</div>
                <div className="text-xs text-muted-foreground">{t.footer.legal}</div>
              </div>
              <Separator />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs tracking-wide text-muted-foreground uppercase">{f.slipAmt}</div>
                  <div className="font-display text-xl">
                    {g.amount ? <>Rp <RollingNumber value={g.amount} format={(n) => fmt(n, lang)} /></> : f.yourChoice}
                  </div>
                </div>
                {g.amount > 0 && (
                  <Button size="sm" variant="outline" className="h-10" onClick={() => copyText(String(g.amount), f.copiedAmt, f.copyFail)}>
                    <Copy /> {f.copyAmt}
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{f.st1hint}</p>
          </Step>

          <Step n={2} title={f.st2}>
            <p
              aria-label={f.preview}
              className="wa-bubble border-t-2 border-dashed border-border pt-3 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground italic"
            >
              {g.message}
            </p>
            <Button asChild size="lg" className="wa-btn h-12 w-full text-base">
              <a href={g.waHref} target="_blank" rel="noopener">
                <MessageCircle /> {f.waBtn}
              </a>
            </Button>
            <p className="text-sm text-muted-foreground">{f.waNum} {WA_DISPLAY}</p>
          </Step>

          <Step n={3} title={f.st3}>
            <p className="text-sm text-muted-foreground">{f.st3p}</p>
          </Step>
        </CardContent>
      </Card>
    </div>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[2.25rem_1fr] gap-4">
      <div className="step-n grid size-9 place-items-center rounded-full bg-primary font-display text-primary-foreground" aria-hidden>{n}</div>
      <div className="grid gap-3">
        <p className="font-semibold">{title}</p>
        {children}
      </div>
    </div>
  )
}

export function CorpBand({ className }: { className?: string }) {
  const { t } = useLang()
  const g = useGive()
  return (
    <div className={cn('corp grid items-center gap-6 rounded-2xl p-7 sm:p-9 md:grid-cols-[1fr_auto]', className)}>
      <div className="grid gap-2">
        <h3 className="font-display text-2xl">{t.form.corpT}</h3>
        <p className="max-w-[60ch] opacity-80">{t.form.corp}</p>
      </div>
      <Button asChild size="lg" variant="secondary" className="h-12 px-6 text-base">
        <a href={g.corpHref} target="_blank" rel="noopener">{t.form.corpBtn}</a>
      </Button>
    </div>
  )
}

const PROMISE_ICONS = [Lock, Receipt, ShieldCheck]

export function LegalList({ className }: { className?: string }) {
  const { t } = useLang()
  return (
    <div className={cn('grid gap-10', className)}>
      <dl className="grid border-t-2 border-foreground md:grid-cols-2 md:gap-x-10">
        {t.legal.rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 border-b py-4">
            <dt className="text-xs tracking-wide text-muted-foreground uppercase">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <ul className="grid gap-6 md:grid-cols-3">
        {t.legal.promises.map((p, i) => {
          const Icon = PROMISE_ICONS[i]
          return (
            <li key={p.t} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              <Icon className="mt-0.5 size-5 text-primary" aria-hidden />
              <h3 className="font-semibold">{p.t}</h3>
              <p className="col-start-2 text-sm text-muted-foreground">{p.p}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function Faq({ className }: { className?: string }) {
  const { t } = useLang()
  return (
    <Accordion type="single" collapsible className={cn('w-full max-w-3xl', className)}>
      {t.faq.items.map((it, i) => (
        <AccordionItem key={i} value={'q' + i}>
          <AccordionTrigger className="py-5 text-left text-base font-semibold sm:text-lg">{it.q}</AccordionTrigger>
          <AccordionContent className="pb-5 text-base text-muted-foreground">{it.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export function Footer({ className }: { className?: string }) {
  const { t } = useLang()
  return (
    <footer className={cn('py-14 text-sm', className)}>
      <div className="wrap grid gap-2">
        <b className="font-display text-lg">{t.footer.name}</b>
        <span>{t.footer.home}</span>
        <span>{t.footer.legal}</span>
        <span>{t.footer.address}</span>
        <span>
          WhatsApp {WA_DISPLAY} · <a className="underline underline-offset-4" href={'mailto:' + EMAIL}>{EMAIL}</a> · Instagram{' '}
          <a className="underline underline-offset-4" href={INSTAGRAM} target="_blank" rel="noopener">@waktraofficial_limanada</a>
        </span>
        <span>© 2026 Yayasan Pendidikan Musik Lima Nada</span>
      </div>
    </footer>
  )
}

/** Consent-safe photo slot: shows until real, consented photos are supplied. */
export function PhotoSlot({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn('photo-slot grid place-items-center rounded-2xl border border-dashed text-sm text-muted-foreground', className)} aria-hidden={!label}>
      {label && <span>{label}</span>}
    </div>
  )
}
