import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';

const modulePath = join(process.cwd(), 'src', 'scripts', 'music-playback.ts');
const source = readFileSync(modulePath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const loadPlayback = () => import(moduleUrl);

test('cycles list, single, and shuffle playback modes', async () => {
  const { nextPlaybackMode } = await loadPlayback();

  assert.equal(nextPlaybackMode('list'), 'single');
  assert.equal(nextPlaybackMode('single'), 'shuffle');
  assert.equal(nextPlaybackMode('shuffle'), 'list');
});

test('wraps the available playlist in list mode', async () => {
  const { selectTrackIndex } = await loadPlayback();
  assert.equal(typeof selectTrackIndex, 'function', 'track selection should exist');

  assert.equal(selectTrackIndex({ mode: 'list', currentIndex: 4, availableIndexes: [0, 2, 4] }), 0);
  assert.equal(
    selectTrackIndex({
      mode: 'list',
      currentIndex: 0,
      availableIndexes: [0, 2, 4],
      direction: -1,
    }),
    4,
  );
});

test('repeats one track only for automatic advancement', async () => {
  const { selectTrackIndex } = await loadPlayback();
  assert.equal(typeof selectTrackIndex, 'function', 'track selection should exist');

  assert.equal(
    selectTrackIndex({
      mode: 'single',
      currentIndex: 2,
      availableIndexes: [0, 2, 4],
      automatic: true,
    }),
    2,
  );
  assert.equal(
    selectTrackIndex({ mode: 'single', currentIndex: 2, availableIndexes: [0, 2, 4] }),
    4,
  );
});

test('shuffle mode selects another available track', async () => {
  const { selectTrackIndex } = await loadPlayback();
  assert.equal(typeof selectTrackIndex, 'function', 'track selection should exist');

  assert.equal(
    selectTrackIndex({
      mode: 'shuffle',
      currentIndex: 2,
      availableIndexes: [0, 2, 4],
      random: () => 0,
    }),
    0,
  );
  assert.equal(
    selectTrackIndex({
      mode: 'shuffle',
      currentIndex: 2,
      availableIndexes: [0, 2, 4],
      random: () => 0.999,
    }),
    4,
  );
});
