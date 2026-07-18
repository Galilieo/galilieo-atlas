import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  createMusicSnapshot,
  getMissingTrackIds,
  renderMusicSnapshotFile,
} from './lib/music-snapshot.mjs';

const args = process.argv.slice(2);
const playlistId = args[0] || '18145116776';
const outputFlag = args.indexOf('--output');
const outputPath = path.resolve(
  outputFlag >= 0 && args[outputFlag + 1] ? args[outputFlag + 1] : 'src/data/music.ts',
);
const headers = {
  'User-Agent': 'Mozilla/5.0',
  Referer: 'https://music.163.com/',
};

async function fetchJson(url) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function probeAudio(id) {
  const audioUrl = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
  try {
    const response = await fetch(audioUrl, {
      headers: { ...headers, Range: 'bytes=0-0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
    });
    const type = response.headers.get('content-type') || '';
    await response.body?.cancel();
    return response.ok && type.startsWith('audio/');
  } catch {
    return false;
  }
}

const playlistUrl = `https://music.163.com/#/playlist?id=${playlistId}`;
const detail = await fetchJson(`https://music.163.com/api/v6/playlist/detail?id=${playlistId}`);
const playlist = detail.playlist;
if (!playlist || !Array.isArray(playlist.trackIds)) throw new Error('网易云歌单响应缺少 trackIds');

let supplementalTracks = [];
const missingIds = getMissingTrackIds(playlist);
if (missingIds.length > 0) {
  const songDetail = await fetchJson(
    `https://music.163.com/api/song/detail/?ids=[${missingIds.join(',')}]`,
  );
  supplementalTracks = songDetail.songs || [];
}

const baseSnapshot = createMusicSnapshot({ playlist, supplementalTracks });
const playableTrackIds = new Set(
  (
    await Promise.all(
      baseSnapshot.tracks.map(async (track) => [track.id, await probeAudio(track.id)]),
    )
  )
    .filter(([, playable]) => playable)
    .map(([id]) => id),
);
const snapshot = createMusicSnapshot({ playlist, supplementalTracks, playableTrackIds });

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, renderMusicSnapshotFile(playlistUrl, snapshot.tracks), 'utf8');
console.log(
  JSON.stringify(
    {
      playlist: snapshot.name,
      playlistId,
      tracks: snapshot.tracks.length,
      playable: snapshot.tracks.filter((track) => track.playable).length,
      output: outputPath,
    },
    null,
    2,
  ),
);
