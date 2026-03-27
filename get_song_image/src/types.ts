export interface AppConfig {
  appleMusicDeveloperToken: string;
  storefront: string;
}

export interface RecommendedSong {
  artist: string;
  title: string;
  image_url?: string | null;
}

export interface SongProfile {
  type: string;
  recommended_songs: RecommendedSong[];
  [key: string]: unknown;
}

export interface SongCandidate {
  id: string;
  artistName: string;
  songName: string;
  artworkUrl?: string;
}

export interface SongProcessSuccess {
  artist: string;
  title: string;
  imageUrl: string;
}

export interface SongProcessFailure {
  artist: string;
  title: string;
  reason: string;
}

export interface SongProcessSummary {
  successes: SongProcessSuccess[];
  failures: SongProcessFailure[];
  updatedProfiles: SongProfile[];
}

export interface AppleMusicSongAttributes {
  artistName: string;
  name: string;
  artwork?: {
    url: string;
  };
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
