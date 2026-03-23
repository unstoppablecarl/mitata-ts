/// <reference lib="esnext" />
type Color = 'red' | 'cyan' | 'white' | 'green' | 'yellow' | 'magenta' | 'blue' | 'black' | 'gray';

export type BenchmarkFn = () => any | Promise<any>;
export type BenchmarkGen = Generator<BenchmarkFn, void, unknown> | AsyncGenerator<BenchmarkFn, void, unknown>;

export interface State<T = Record<string, any>> {
  get<K extends keyof T>(name: K): T[K];
}

export interface IteratorState {
  [Symbol.iterator](): Iterator<undefined, void, undefined>;
  [Symbol.asyncIterator](): AsyncIterator<undefined, void, undefined>;
}

export interface BenchmarkOptions {
  now?: () => number;
  gc?: boolean | (() => void);
  inner_gc?: boolean;
  heap?: () => number;
  concurrency?: number;
  min_samples?: number;
  max_samples?: number;
  min_cpu_time?: number;
  batch_unroll?: number;
  batch_samples?: number;
  warmup_samples?: number;
  batch_threshold?: number;
  warmup_threshold?: number;
  samples_threshold?: number;
}

export interface BenchmarkOptionsWithArgs<T extends Record<string, any>> extends BenchmarkOptions {
  args: T;
}

export interface Stats {
  debug: string;
  ticks: number;
  samples: number[];
  kind: 'fn' | 'iter' | 'yield';
  min: number; max: number; avg: number;
  p25: number; p50: number; p75: number;
  p99: number; p999: number;
  counters?: Record<string, any>;
  gc?: { avg: number, min: number, max: number, total: number };
  heap?: { avg: number, min: number, max: number, total: number };
}

// Low-level measurement API
export function measure(fn: BenchmarkFn, opts?: BenchmarkOptions): Promise<Stats>;
export function measure(gen: (state: State<void>) => BenchmarkGen, opts?: BenchmarkOptions): Promise<Stats>;
export function measure<T extends Record<string, any>>(gen: (state: State<T>) => BenchmarkGen, opts: BenchmarkOptionsWithArgs<T>): Promise<Stats>;

// High-level API
export function bench(fn: BenchmarkFn): B;
export function bench(name: string, fn: BenchmarkFn): B;
export function bench(gen: (state: State) => BenchmarkGen): B;
export function bench(name: string, gen: (state: State) => BenchmarkGen): B;

export function do_not_optimize(v: any): void;

export function group(f: () => any): void;
export function compact(f: () => any): void;
export function summary(f: () => any): void;
export function boxplot(f: () => any): void;
export function barplot(f: () => any): void;
export function lineplot(f: () => any): void;
export function group(name: string, f: () => any): void;

type RunFormat = 'json'
  | 'quiet'
  | 'mitata'
  | 'markdown'
  | { json: { debug?: boolean, samples?: boolean } }
  | { mitata: { name?: number | 'fixed' | 'longest' } }

type RunOptions = {
  throw?: boolean;
  filter?: RegExp;
  colors?: boolean;
  print?: (s: string) => void;
  observe?: (t: Trial) => Trial;
  format?:
    RunFormat
}

export function run(opts?: RunOptions): Promise<Report>;

export interface Report {
  layout: Layout[];
  benchmarks: Trial[];
  context: {
    now: number;
    arch: string | null;
    runtime: string | null;
    cpu: { freq: number; name: string | null };
  };
}

interface Layout {
  id: number;
  name: string | null;
  types: string[];
}

export const flags: {
  compact: number;
  baseline: number;
}

type Run = ({
  stats: Stats;
  error: undefined;
} | {
  stats: undefined;
  error: Error | unknown;
}) & {
  name: string;
  args: Record<string, any>;
}

interface Trial {
  runs: Run[];
  alias: string;
  baseline: boolean;
  args: Record<string, any[]>;
  kind: 'args' | 'static' | 'multi-args';
  style: {
    compact: boolean;
    highlight: false | string;
  };
}

export class B {
  // Constructors in declaration files can be overloaded
  constructor(name: string, fn: BenchmarkFn);
  constructor(name: string, gen: (state: State) => BenchmarkGen);

  compact(bool?: boolean): this;
  baseline(bool?: boolean): this;
  highlight(color?: Color): this;
  gc(gc?: 'once' | 'inner' | boolean): this;
  name(name: string, highlight?: Color): this;

  run(thrw?: boolean): Promise<Trial>;

  // Arguments handling
  args(values: any[]): this;
  args(map: Record<string, any[]>): this;
  args(name: string, values: any[]): this;
  range(name: string, s: number, e: number, multiplier?: number): this;
  dense_range(name: string, s: number, e: number, accumulator?: number): this;
}