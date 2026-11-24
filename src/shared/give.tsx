import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { WA_NUMBER, type Lang, type PurposeKey } from '@/content'
import { useLang } from './i18n'

/** Indonesian number-to-words, like the "terbilang" line on receipts. */
export function terbilang(n: number): string {
  const s = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas']
  const t = (n: number): string => {
    if (n < 12) return s[n]
    if (n < 20) return t(n - 10) + ' belas'
    if (n < 100) return t(Math.floor(n / 10)) + ' puluh' + (n % 10 ? ' ' + t(n % 10) : '')
    if (n < 200) return 'seratus' + (n - 100 ? ' ' + t(n - 100) : '')
    if (n < 1000) return t(Math.floor(n / 100)) + ' ratus' + (n % 100 ? ' ' + t(n % 100) : '')
    if (n < 2000) return 'seribu' + (n - 1000 ? ' ' + t(n - 1000) : '')
    if (n < 1e6) return t(Math.floor(n / 1000)) + ' ribu' + (n % 1000 ? ' ' + t(n % 1000) : '')
    if (n < 1e9) return t(Math.floor(n / 1e6)) + ' juta' + (n % 1e6 ? ' ' + t(n % 1e6) : '')
    if (n < 1e12) return t(Math.floor(n / 1e9)) + ' miliar' + (n % 1e9 ? ' ' + t(n % 1e9) : '')
    return t(Math.floor(n / 1e12)) + ' triliun' + (n % 1e12 ? ' ' + t(n % 1e12) : '')
  }
  const w = t(n)
  return w.charAt(0).toUpperCase() + w.slice(1) + ' rupiah'
}

export function enWords(n: number): string {
  const o = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
  const tn = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  const h = (n: number) => {
    let r = ''
    if (n >= 100) {
      r = o[Math.floor(n / 100)] + ' hundred'
      n %= 100
      if (n) r += ' and '
    }
    if (n >= 20) r += tn[Math.floor(n / 10)] + (n % 10 ? '-' + o[n % 10] : '')
    else if (n) r += o[n]
    return r
  }
  const units = ['', ' thousand', ' million', ' billion', ' trillion']
  const parts: string[] = []
  let i = 0
  while (n > 0) {
    const c = n % 1000
    if (c) parts.unshift(h(c) + units[i])
    n = Math.floor(n / 1000)
    i++
  }
  const w = parts.join(' ')
  return w.charAt(0).toUpperCase() + w.slice(1) + ' rupiah'
}

export const fmt = (n: number, lang: Lang) => n.toLocaleString(lang === 'en' ? 'en-US' : 'id-ID')

type GiveState = {
  amount: number
  setAmount: (n: number) => void
  monthly: boolean
  setMonthly: (b: boolean) => void
  purpose: PurposeKey
  setPurpose: (p: PurposeKey) => void
  name: string
  setName: (s: string) => void
  paid: boolean
  setPaid: (b: boolean) => void
  message: string
  waHref: string
  corpHref: string
  words: string
  /** Choose a programme from anywhere on the page and jump to the form. */
  pick: (p: PurposeKey) => void
}

const GiveCtx = createContext<GiveState | null>(null)

export function GiveProvider({ children }: { children: ReactNode }) {
  const { lang, t } = useLang()
  const [amount, setAmount] = useState(0)
  const [monthly, setMonthly] = useState(true)
  const [purpose, setPurpose] = useState<PurposeKey>('umum')
  const [name, setName] = useState('')
  const [paid, setPaid] = useState(false)

  const message = useMemo(() => {
    const n = amount
    const p = t.purposeMsg[purpose]
    const nm = name.trim()
    if (lang === 'en') {
      const who = nm ? "I'm " + nm + '. ' : ''
      const amt = n ? 'Rp ' + fmt(n, lang) + (monthly ? ' per month' : ' (one time)') : "an amount I'd like to discuss"
      if (paid) return `Hello Lima Nada, ${who}I have transferred ${amt} to the Mandiri account of Yayasan Pendidikan Musik Lima Nada, for ${p}. My transfer receipt is attached. Could you please send the official receipt? Thank you.`
      return `Hello Lima Nada, ${who}I would like to support the foundation with ${amt} for ${p}. Could you tell me the next steps? Thank you.`
    }
    const saya = nm ? 'saya ' + nm + ', ' : ''
    const nom = n ? 'Rp ' + fmt(n, lang) + (monthly ? ' setiap bulan' : ' (satu kali)') : 'nominal yang ingin saya diskusikan dulu'
    if (paid) return `Halo Lima Nada, ${saya}sudah transfer dukungan sebesar ${nom} ke rekening Mandiri Yayasan Pendidikan Musik Lima Nada, untuk ${p}. Bukti transfer saya lampirkan. Mohon dikirimkan tanda terimanya. Terima kasih.`
    return `Halo Lima Nada, ${saya}saya ingin mendukung yayasan dengan ${nom} untuk ${p}. Mohon info langkah selanjutnya. Terima kasih.`
  }, [amount, monthly, purpose, name, paid, lang, t])

  const pick = (p: PurposeKey) => {
    setPurpose(p)
    if (p === 'kakakasuh') setMonthly(true)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('dukung')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
    // On touch screens, focusing would pop the keyboard over the form the visitor just landed on.
    if (!matchMedia('(pointer: coarse)').matches) setTimeout(() => document.getElementById('amount')?.focus({ preventScroll: true }), 600)
  }

  const value: GiveState = {
    amount, setAmount, monthly, setMonthly, purpose, name,
    setPurpose: (p: PurposeKey) => {
      setPurpose(p)
      if (p === 'kakakasuh') setMonthly(true)
    }, setName, paid, setPaid, message, pick,
    waHref: 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message),
    corpHref: 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(t.form.corpMsg),
    words: amount ? (lang === 'en' ? enWords(amount) : terbilang(amount)) : '',
  }
  return <GiveCtx.Provider value={value}>{children}</GiveCtx.Provider>
}

export function useGive() {
  const c = useContext(GiveCtx)
  if (!c) throw new Error('useGive outside GiveProvider')
  return c
}
