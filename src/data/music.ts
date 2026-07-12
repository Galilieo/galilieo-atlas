export interface HomeMusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  sourceUrl: string;
  audioUrl: string;
  playable: boolean;
}

export const homeMusicPlaylistUrl = 'https://music.163.com/#/playlist?id=18145116776';

/** 由 `pnpm run sync:music` 从公开网易云歌单生成；构建和访问页面时不请求元数据接口。 */
export const homeMusicTracks: HomeMusicTrack[] = [
  {
    id: '1804552408',
    title: '远旅休憩中的邂逅',
    artist: '泠鸢yousa',
    album: '折纸信笺',
    cover: 'https://p1.music.126.net/vZQ6fdcFVjhUJB96BaEnwg==/109951165543194247.jpg',
    sourceUrl: 'https://music.163.com/#/song?id=1804552408',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=1804552408.mp3',
    playable: true,
  },
  {
    id: '2615403834',
    title: '屑屑',
    artist: 'ChiliChill乐团',
    album: '屑屑',
    cover: 'https://p1.music.126.net/UGl8LDXnxRn6OidaM6Tzlw==/109951169854682128.jpg',
    sourceUrl: 'https://music.163.com/#/song?id=2615403834',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=2615403834.mp3',
    playable: true,
  },
  {
    id: '2617356789',
    title: '衡山路宛平路',
    artist: 'ChiliChill乐团',
    album: '衡山路宛平路',
    cover: 'https://p1.music.126.net/KixdzOypuC4lq0QwcdXbpg==/109951169872259384.jpg',
    sourceUrl: 'https://music.163.com/#/song?id=2617356789',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=2617356789.mp3',
    playable: true,
  },
  {
    id: '1903401563',
    title: 'Outer Wilds',
    artist: 'Andrew Prahlow',
    album: 'Outer Wilds - Original Soundtrack',
    cover: 'https://p1.music.126.net/MmzJiU8aTJIKggreKtyiRA==/109951166726773143.jpg',
    sourceUrl: 'https://music.163.com/#/song?id=1903401563',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=1903401563.mp3',
    playable: true,
  },
  {
    id: '3378909144',
    title: '辞职信',
    artist: 'ChiliChill乐团',
    album: '辞职信',
    cover: 'https://p1.music.126.net/x1_zJ4Hboalxh_56GeOYoA==/109951173180770409.jpg',
    sourceUrl: 'https://music.163.com/#/song?id=3378909144',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=3378909144.mp3',
    playable: true,
  },
  {
    id: '2709782062',
    title: '下等马',
    artist: 'ChiliChill乐团',
    album: '下等马',
    cover: 'https://p1.music.126.net/TPJ5f1o6WaWzKwHD1hJ19Q==/109951171126463467.jpg',
    sourceUrl: 'https://music.163.com/#/song?id=2709782062',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=2709782062.mp3',
    playable: true,
  },
  {
    id: '3340112782',
    title: '星降る海',
    artist: 'Aqu3ra / 早見沙織',
    album: '超かぐや姫！',
    cover: 'https://p1.music.126.net/rwWOrSz65eAdnQsHy9Vghw==/109951172602675059.jpg',
    sourceUrl: 'https://music.163.com/#/song?id=3340112782',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=3340112782.mp3',
    playable: true,
  },
];
