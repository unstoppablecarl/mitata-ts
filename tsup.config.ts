import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/lib.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  target: 'esnext',
  outDir: 'dist',
  external: ['bun:jsc'],
})
