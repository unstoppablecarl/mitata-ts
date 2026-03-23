import { now, print } from '../dist/lib.js';
import { run, bench, boxplot, barplot, lineplot, measure } from '../dist/main.js';

boxplot(() => {
// barplot(() => {
// lineplot(() => {
  bench('noop', () => { });

  bench('test', function* (state) {
    const size = state.get(0);
    yield () => new Array(size);
  }).args([0]);
});

// cpu info
await run();

// while (true) print(`${now() / 1e6}`);

while (true) {
  const s = await measure(() => { });

  print(`${s.avg}`);
  if (1 < s.avg) print(s.debug);
}