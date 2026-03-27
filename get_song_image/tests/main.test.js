import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { processSongs } from "../src/main.js";
const tempDirs = [];
afterEach(async () => {
    delete process.env.APPLE_MUSIC_DEVELOPER_TOKEN;
    delete process.env.OUTPUT_DIR;
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});
describe("processSongs", () => {
    it("processes inputs and records success and failures", async () => {
        const baseDir = await mkdtemp(path.join(os.tmpdir(), "song-image-app-"));
        tempDirs.push(baseDir);
        const outputDir = path.join(baseDir, "images");
        const inputPath = path.join(baseDir, "songs.csv");
        await writeFile(path.join(baseDir, ".env"), "APPLE_MUSIC_DEVELOPER_TOKEN=test-token\nOUTPUT_DIR=./images\n");
        await writeFile(inputPath, "artist_name,song_name\nAimer,Brave Shine\nUnknown,Song\n");
        const searchSongsImpl = async (_config, artistName, songName) => {
            if (artistName === "Aimer" && songName === "Brave Shine") {
                return [
                    {
                        id: "song-1",
                        artistName: "Aimer",
                        songName: "Brave Shine",
                        artworkUrl: "https://example.com/{w}x{h}.jpg",
                    },
                ];
            }
            return [];
        };
        const downloadImageImpl = async (_imageUrl, _dir, filename) => path.join(outputDir, filename);
        const summary = await processSongs(baseDir, inputPath, {
            searchSongsImpl,
            downloadImageImpl,
        });
        expect(summary.successes).toHaveLength(1);
        expect(summary.successes[0]?.matchedSongId).toBe("song-1");
        expect(summary.failures).toEqual([
            {
                input: {
                    artistName: "Unknown",
                    songName: "Song",
                    imageFilename: undefined,
                },
                reason: "song not found",
            },
        ]);
    });
});
