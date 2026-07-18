function quote(value) {
  return JSON.stringify(value ?? '');
}

function secureUrl(value) {
  return typeof value === 'string' ? value.replace(/^http:\/\//, 'https://') : '';
}

function normalizeTrack(track) {
  const id = String(track.id);
  const artist = (track.ar || track.artists || [])
    .map((item) => item.name)
    .filter(Boolean)
    .join(' / ');
  const album = track.al || track.album || {};
  return {
    id,
    title: track.name || '未知歌曲',
    artist: artist || '未知歌手',
    album: album.name || '',
    cover: secureUrl(album.picUrl),
    sourceUrl: `https://music.163.com/#/song?id=${id}`,
    audioUrl: `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
  };
}

export function getMissingTrackIds(playlist) {
  const sourceTracks = Array.isArray(playlist.tracks) ? playlist.tracks : [];
  const sourceIds = new Set(sourceTracks.map((track) => String(track.id)));
  return playlist.trackIds.map((item) => String(item.id)).filter((id) => !sourceIds.has(id));
}

export function createMusicSnapshot({
  playlist,
  supplementalTracks = [],
  playableTrackIds = new Set(),
}) {
  const sourceTracks = [
    ...(Array.isArray(playlist.tracks) ? playlist.tracks : []),
    ...supplementalTracks,
  ];
  const byId = new Map(sourceTracks.map((track) => [String(track.id), track]));
  const tracks = playlist.trackIds
    .map((item) => byId.get(String(item.id)))
    .filter(Boolean)
    .map((track) => {
      const normalized = normalizeTrack(track);
      return { ...normalized, playable: playableTrackIds.has(normalized.id) };
    });

  return {
    name: typeof playlist.name === 'string' ? playlist.name : '',
    tracks,
  };
}

export function renderMusicSnapshotFile(playlistUrl, tracks) {
  const rows = tracks
    .map(
      (track) => `  {
    id: ${quote(track.id)},
    title: ${quote(track.title)},
    artist: ${quote(track.artist)},
    album: ${quote(track.album)},
    cover: ${quote(track.cover)},
    sourceUrl: ${quote(track.sourceUrl)},
    audioUrl: ${quote(track.audioUrl)},
    playable: ${track.playable},
  },`,
    )
    .join('\n');

  return `export interface HomeMusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  sourceUrl: string;
  audioUrl: string;
  playable: boolean;
}

export const homeMusicPlaylistUrl = ${quote(playlistUrl)};

/** 由 \`pnpm run sync:music\` 从公开网易云歌单生成；构建和访问页面时不请求元数据接口。 */
export const homeMusicTracks: HomeMusicTrack[] = [
${rows}
];
`;
}
