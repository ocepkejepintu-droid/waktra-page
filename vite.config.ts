import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// CONCEPT=a|b|c picks which redesign concept is bundled.
// SINGLE=1 inlines everything into one HTML file (used for artifact previews).
const concept = process.env.CONCEPT ?? 'a'
const single = process.env.SINGLE === '1'

export default defineConfig({
  plugins: [react(), tailwindcss(), ...(single ? [viteSingleFile()] : [])],
  define: { __CONCEPT__: JSON.stringify(concept) },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: { outDir: single ? `dist-preview/${concept}` : 'dist', emptyOutDir: true },
})
