import { describe, expect, it } from "vitest";

import { selectBestMatch } from "../src/selectBestMatch.js";
import type { RecommendedSong, SongCandidate } from "../src/types.js";

describe("selectBestMatch", () => {
  const input: RecommendedSong = {
    artist: "Aimer",
    title: "Brave Shine",
  };

  it("prefers the candidate with the best combined song and artist score", () => {
    const candidates: SongCandidate[] = [
      { id: "1", artistName: "Aimer", songName: "Brave Shine", artworkUrl: "https://example.com/{w}x{h}.jpg" },
      { id: "2", artistName: "Other", songName: "Brave", artworkUrl: "https://example.com/{w}x{h}.jpg" },
    ];

    expect(selectBestMatch(input, candidates)?.id).toBe("1");
  });

  it("returns null when every candidate is below threshold", () => {
    const candidates: SongCandidate[] = [
      { id: "1", artistName: "Other", songName: "Unknown", artworkUrl: "https://example.com/{w}x{h}.jpg" },
    ];

    expect(selectBestMatch(input, candidates)).toBeNull();
  });
});
