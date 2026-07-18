export const playbackModes = ['list', 'single', 'shuffle'] as const;

export type PlaybackMode = (typeof playbackModes)[number];

interface TrackSelectionOptions {
  mode: PlaybackMode;
  currentIndex: number;
  availableIndexes: number[];
  direction?: -1 | 1;
  automatic?: boolean;
  random?: () => number;
}

export function nextPlaybackMode(mode: PlaybackMode): PlaybackMode {
  return playbackModes[(playbackModes.indexOf(mode) + 1) % playbackModes.length];
}

export function selectTrackIndex({
  mode,
  currentIndex,
  availableIndexes,
  direction = 1,
  automatic = false,
  random = Math.random,
}: TrackSelectionOptions): number | undefined {
  if (availableIndexes.length === 0) return undefined;
  if (mode === 'single' && automatic && availableIndexes.includes(currentIndex))
    return currentIndex;

  if (mode === 'shuffle') {
    const candidates = availableIndexes.filter((index) => index !== currentIndex);
    if (candidates.length === 0) return availableIndexes[0];
    const randomIndex = Math.min(
      candidates.length - 1,
      Math.max(0, Math.floor(random() * candidates.length)),
    );
    return candidates[randomIndex];
  }

  const position = availableIndexes.indexOf(currentIndex);
  if (position >= 0)
    return availableIndexes[
      (position + direction + availableIndexes.length) % availableIndexes.length
    ];

  const fallback = availableIndexes.filter((index) =>
    direction === 1 ? index > currentIndex : index < currentIndex,
  );
  return direction === 1
    ? (fallback[0] ?? availableIndexes[0])
    : (fallback.at(-1) ?? availableIndexes.at(-1));
}
