import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { COPY, type Copy, type Lang } from '@/content'

type Ctx = { lang: Lang; t: Copy; toggle: () => void }
const LangCtx = createContext<Ctx | null>(null)

function initialLang(): Lang {
  if (location.hash === '#en') return 'en'
  if (location.hash === '#id') return 'id'
  try {
    const v = localStorage.getItem('limanada-lang')
    if (v === 'en' || v === 'id') return v
  } catch {
    /* storage blocked: default to Indonesian */
  }
  return 'id'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = lang === 'en' ? 'Support Lima Nada' : 'Dukung Lima Nada'
    try {
      localStorage.setItem('limanada-lang', lang)
    } catch {
      /* ignore */
    }
  }, [lang])
  const toggle = () => {
    const next = lang === 'en' ? 'id' : 'en'
    setLang(next)
    try {
      history.replaceState(null, '', '#' + next)
    } catch {
      /* ignore */
    }
  }
  return <LangCtx.Provider value={{ lang, t: COPY[lang], toggle }}>{children}</LangCtx.Provider>
}

export function useLang() {
  const c = useContext(LangCtx)
  if (!c) throw new Error('useLang outside LangProvider')
  return c
}
