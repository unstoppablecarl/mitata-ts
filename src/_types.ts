import { $, B } from './main'

export type BenchFnType = 'fn' | 'iter' | 'yield'

export interface Stats {
  debug: string
  ticks: number
  samples: number[]
  kind: BenchFnType
  min: number
  max: number
  avg: number
  p25: number
  p50: number
  p75: number
  p99: number
  p999: number
  gc?: { avg: number, min: number, max: number, total: number }
  heap?: { avg: number, min: number, max: number, total: number }
  counters?: Record<string, any>
}

export type GCType = 'once' | 'inner' | boolean

export interface GCFunc {
  (): void
  fallback?: boolean
}

export interface k_options {
  now?: () => number
  inner_gc?: boolean
  heap?: boolean | (() => number) | null
  concurrency?: number
  min_samples?: number
  max_samples?: number
  min_cpu_time?: number
  batch_unroll?: number
  batch_samples?: number
  warmup_samples?: number
  batch_threshold?: number
  warmup_threshold?: number
  samples_threshold?: number
  gc?: boolean | GCFunc
  params?: Record<string, any>
  manual?: false | 'real' | 'manual'
  $counters?: boolean
  args?: Record<string, any>
}

export type CollectionType = 'x' | 'b' | 's' | 'l' | 'g'

export type Color = typeof $.colors[number]

export interface State<T = Record<string, any>> {
  get<K extends keyof T>(name: K): T[K]
}

export interface IteratorState {
  [Symbol.iterator](): Iterator<undefined, void, undefined>
  [Symbol.asyncIterator](): AsyncIterator<undefined, void, undefined>
  get(name: string): any
}

export interface LayoutStats extends Stats {
  counters?: Record<string, any>
}

export type RunFormat = 'json'
  | 'quiet'
  | 'mitata'
  | 'markdown'
  | { json: { debug?: boolean, samples?: boolean } }
  | { mitata: { name?: number | 'fixed' | 'longest' } }

export type RunOptions = {
  throw?: boolean
  filter?: RegExp
  colors?: boolean
  print?: (s: string) => void
  observe?: (t: Trial) => Trial
  format?:
    RunFormat
}

export type Context = {
  now: number
  arch: string | null
  runtime: string | null
  cpu: {
    freq: number
    name: string | null
  }
  version: string
  noop: {
    fn: Stats,
    iter: Stats,
    fn_gc: Stats,
  },
}

export interface Result {
  layout: Layout[]
  benchmarks: Trial[]
  context: Context
}

export interface Layout {
  name: string | null
  types: CollectionType[]
}

export type Run = ({
  stats: LayoutStats
  error: undefined
} | {
  stats: undefined
  error: Error | unknown
}) & {
  name: string
  args: Record<string, any>
}

export type ArgsType = 'args' | 'static' | 'multi-args'

export interface Trial {
  runs: Run[]
  alias: string
  baseline: boolean
  args: Record<string, any[]>
  kind: ArgsType
  group: number
  style: {
    compact: boolean
    highlight: false | Color
  }
}

export type CollectionItem = {
  id: number
  name: string | null
  types: CollectionType[]
  trials: B[]
}

export type Bounds = {
  ymax?: number
  ymin?: number
  xmin?: number
  xmax?: number
}

export type ColorBounds = {
  ymax?: Color
  ymin?: Color
  xmin?: Color
  xmax?: Color
}

export interface k_args<T extends Record<string, any>> extends k_options {
  args: T;
}

type BenchmarkFn = (...args: any[]) => any;

export type YieldValue =
  | BenchmarkFn

  | {
  bench?: BenchmarkFn;
  // function or flag
  manual?: BenchmarkFn | boolean;

  heap?: boolean;
  counters?: boolean;
  concurrency?: number;
  budget?: string;

  [paramIndex: number]: unknown;
};

export type Gen =
  | Generator<YieldValue, void, undefined>
  | AsyncGenerator<YieldValue | Promise<YieldValue>, void, undefined>;

export type GenFactory = (ctx: k_statefree) => Gen;

export interface k_state {
  get(name: string): any;
}

export interface k_statefree {
  get(name: string): undefined;
}

export interface k_statefull<T extends Record<string, any>> {
  get<K extends keyof T>(name: K): T[K];
}

export interface k_iter {
  [Symbol.iterator](): Iterator<undefined, void, undefined>;
  [Symbol.asyncIterator](): AsyncIterator<undefined, void, undefined>;
}