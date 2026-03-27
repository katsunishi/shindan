export interface AppConfig {
  appleMusicDeveloperToken: string;
  storefront: string;
}

export interface RecommendedSong {
  artist: string;
  title: string;
  image_url?: string | null;
  preview_url?: string | null;
}

export type RecommendedSongsByType = Record<string, RecommendedSong[]>;

export interface SongCandidate {
  id: string;
  artistName: string;
  songName: string;
  artworkUrl?: string;
  previewUrl?: string;
}

export interface SongProcessSuccess {
  type: string;
  artist: string;
  title: string;
  previewUrl: string;
}

export interface SongProcessFailure {
  type: string;
  artist: string;
  title: string;
  reason: string;
}

export interface SongProcessSummary {
  successes: SongProcessSuccess[];
  failures: SongProcessFailure[];
  updatedSongsByType: RecommendedSongsByType;
}

export interface AppleMusicSongAttributes {
  artistName: string;
  name: string;
  artwork?: {
    url: string;
  };
  previews?: Array<{
    url?: string;
  }>;
}

export interface AppleMusicSearchResponse {
  results?: {
    songs?: {
      data?: Array<{
        id: string;
        attributes?: AppleMusicSongAttributes;
      }>;
    };
  };
}
