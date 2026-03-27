import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { processSongsJson } from "../src/main.js";
import type { AppConfig, SongCandidate } from "../src/types.js";

const tempDirs: string[] = [];

afterEach(async () => {
  delete process.env.APPLE_MUSIC_DEVELOPER_TOKEN;
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("processSongsJson", () => {
  it("updates recommended_songs with image_url values", async () => {
    const baseDir = await mkdtemp(path.join(os.tmpdir(), "song-image-json-"));
    tempDirs.push(baseDir);

    const inputPath = path.join(baseDir, "songs.json");
    await writeFile(path.join(baseDir, ".env"), "APPLE_MUSIC_DEVELOPER_TOKEN=test-token\n");
    await writeFile(
      inputPath,
      `${JSON.stringify([
        {
          type: "ENTJ",
          recommended_songs: [
            { artist: "Kanye West", title: "POWER" },
            { artist: "Missing", title: "Unknown" },
          ],
        },
      ])}\n`,
    );

    const searchSongsImpl = async (
      _config: AppConfig,
      artistName: string,
      songName: string,
    ): Promise<SongCandidate[]> => {
      if (artistName === "Kanye West" && songName === "POWER") {
        return [
          {
            id: "song-1",
            artistName: "Kanye West",
            songName: "POWER",
            artworkUrl: "https://example.com/{w}x{h}.jpg",
          },
        ];
      }

      return [];
    };

    const summary = await processSongsJson(baseDir, inputPath, {
      searchSongsImpl,
    });

    const updatedContent = await readFile(inputPath, "utf8");
    const updatedJson = JSON.parse(updatedContent) as Array<{
      recommended_songs: Array<{ image_url?: string | null }>;
    }>;

    expect(summary.successes).toHaveLength(1);
    expect(summary.failures).toEqual([
      {
        artist: "Missing",
        title: "Unknown",
        reason: "song not found",
      },
    ]);
    expect(updatedJson[0]?.recommended_songs[0]?.image_url).toBe("https://example.com/1000x1000.jpg");
    expect(updatedJson[0]?.recommended_songs[1]?.image_url).toBeNull();
  });
});
