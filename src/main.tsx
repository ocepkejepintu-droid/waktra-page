import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

declare const __CONCEPT__: string

// The concept is fixed at build time (CONCEPT=a|b|c); unused concepts are tree-shaken out.
const Page =
  __CONCEPT__ === 'b'
    ? lazy(() => import('./concepts/b/Page'))
    : __CONCEPT__ === 'c'
      ? lazy(() => import('./concepts/c/Page'))
      : lazy(() => import('./concepts/a/Page'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  </StrictMode>,
)
