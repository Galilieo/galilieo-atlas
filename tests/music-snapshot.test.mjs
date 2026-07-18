import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

const snapshotModule = await import('../scripts/lib/music-snapshot.mjs').catch(() => undefined);

const playlist = {
  name: 'Fixture playlist',
  trackIds: [{ id: 2 }, { id: 1 }, { id: 3 }],
  tracks: [
    {
      id: 1,
      name: 'First',
      ar: [{ name: 'Artist A' }],
      al: { name: 'Album A', picUrl: 'http://images.example/first.jpg' },
    },
    {
      id: 2,
      name: 'Second',
      artists: [{ name: 'Artist B' }],
      album: { name: 'Album B', picUrl: 'https://images.example/second.jpg' },
    },
  ],
};

describe('Music Snapshot generation', () => {
  test('provides a pure snapshot Module', () => {
    assert.equal(typeof snapshotModule?.getMissingTrackIds, 'function');
    assert.equal(typeof snapshotModule?.createMusicSnapshot, 'function');
    assert.equal(typeof snapshotModule?.renderMusicSnapshotFile, 'function');
  });

  test('identifies missing details in playlist order', () => {
    assert.ok(snapshotModule, 'Music Snapshot Module is missing');
    assert.deepEqual(snapshotModule.getMissingTrackIds(playlist), ['3']);
  });

  test('preserves trackIds order, upgrades covers, and keeps unplayable songs', () => {
    assert.ok(snapshotModule, 'Music Snapshot Module is missing');
    const snapshot = snapshotModule.createMusicSnapshot({
      playlist,
      supplementalTracks: [{ id: 3, name: '', ar: [], al: {} }],
      playableTrackIds: new Set(['2', '3']),
    });

    assert.equal(snapshot.name, 'Fixture playlist');
    assert.deepEqual(
      snapshot.tracks.map(({ id }) => id),
      ['2', '1', '3'],
    );
    assert.deepEqual(
      snapshot.tracks.map(({ playable }) => playable),
      [true, false, true],
    );
    assert.equal(snapshot.tracks[0].artist, 'Artist B');
    assert.equal(snapshot.tracks[1].cover, 'https://images.example/first.jpg');
    assert.equal(snapshot.tracks[2].title, '未知歌曲');
    assert.equal(snapshot.tracks[2].artist, '未知歌手');
  });

  test('renders deterministic TypeScript without dropping unavailable tracks', () => {
    assert.ok(snapshotModule, 'Music Snapshot Module is missing');
    const snapshot = snapshotModule.createMusicSnapshot({
      playlist,
      supplementalTracks: [{ id: 3, name: 'Third', ar: [], al: {} }],
      playableTrackIds: new Set(['2']),
    });
    const playlistUrl = 'https://music.163.com/#/playlist?id=fixture';
    const first = snapshotModule.renderMusicSnapshotFile(playlistUrl, snapshot.tracks);
    const second = snapshotModule.renderMusicSnapshotFile(playlistUrl, snapshot.tracks);

    assert.equal(first, second);
    assert.match(first, /export interface HomeMusicTrack/);
    assert.match(first, /export const homeMusicPlaylistUrl = "https:\/\/music\.163\.com/);
    assert.match(first, /id: "1"[\s\S]*?playable: false/);
    assert.match(first, /id: "3"[\s\S]*?playable: false/);
  });
});
