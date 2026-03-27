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
      },
    ];
  });
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
  return mapSearchResponse(payload);
}

export { mapSearchResponse };
