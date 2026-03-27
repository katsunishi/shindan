import type { AppConfig, AppleMusicSearchResponse, SongCandidate } from "./types.js";

function mapSearchResponse(response: AppleMusicSearchResponse): SongCandidate[] {
  const songs = response.results?.songs?.data ?? [];

  return songs.flatMap((song) => {
    const attributes = song.attributes;
    if (!attributes) {
      return [];
    }

    return [
      {
        id: song.id,
        artistName: attributes.artistName,
        songName: attributes.name,
        artworkUrl: attributes.artwork?.url,
        previewUrl: attributes.previews?.[0]?.url,
      },
    ];
  });
}

interface ITunesSearchResponse {
  results?: Array<{
    trackId?: number;
    artistName?: string;
    trackName?: string;
    previewUrl?: string;
    artworkUrl100?: string;
  }>;
}

function normalizeITunesArtworkUrl(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }

  return url.replace(/\/\d+x\d+bb\./u, "/1000x1000bb.");
}

function mapITunesResponse(response: ITunesSearchResponse): SongCandidate[] {
  const songs = response.results ?? [];

  return songs.flatMap((song) => {
    if (!song.trackId || !song.artistName || !song.trackName) {
      return [];
    }

    return [
      {
        id: String(song.trackId),
        artistName: song.artistName,
        songName: song.trackName,
        artworkUrl: normalizeITunesArtworkUrl(song.artworkUrl100),
        previewUrl: song.previewUrl,
      },
    ];
  });
}

async function searchITunesSongs(
  artistName: string,
  songName: string,
  fetchImpl: typeof fetch,
): Promise<SongCandidate[]> {
  const url = new URL("https://itunes.apple.com/search");
  url.searchParams.set("term", `${artistName} ${songName}`);
  url.searchParams.set("entity", "song");
  url.searchParams.set("country", "US");
  url.searchParams.set("limit", "10");

  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`iTunes Search API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ITunesSearchResponse;
  return mapITunesResponse(payload);
}

export async function searchSongs(
  config: AppConfig,
  artistName: string,
  songName: string,
  fetchImpl: typeof fetch = fetch,
): Promise<SongCandidate[]> {
  const term = `${artistName} ${songName}`;
  const url = new URL(`https://api.music.apple.com/v1/catalog/${config.storefront}/search`);
  url.searchParams.set("term", term);
  url.searchParams.set("types", "songs");
  url.searchParams.set("limit", "10");

  const response = await fetchImpl(url, {
    headers: {
      Authorization: `Bearer ${config.appleMusicDeveloperToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Apple Music API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as AppleMusicSearchResponse;
  const appleCandidates = mapSearchResponse(payload);
  const iTunesCandidates = await searchITunesSongs(artistName, songName, fetchImpl);

  return [...appleCandidates, ...iTunesCandidates];
}

export { mapITunesResponse, mapSearchResponse };
