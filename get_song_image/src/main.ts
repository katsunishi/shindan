import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildArtworkUrl } from "./artwork.js";
import { loadConfig } from "./config.js";
import { readProfiles, writeProfiles } from "./readInput.js";
import { searchSongs } from "./searchSong.js";
import { selectBestMatch } from "./selectBestMatch.js";
import type { RecommendedSong, SongProcessSummary } from "./types.js";

export interface ProcessSongsDependencies {
  searchSongsImpl?: typeof searchSongs;
}

export async function processSongsJson(
  baseDir: string,
  inputPath: string,
  dependencies: ProcessSongsDependencies = {},
): Promise<SongProcessSummary> {
  const config = await loadConfig(baseDir);
  const profiles = await readProfiles(inputPath);
  const searchSongsImpl = dependencies.searchSongsImpl ?? searchSongs;

  const summary: SongProcessSummary = {
    successes: [],
    failures: [],
    updatedProfiles: profiles,
  };

  for (const profile of profiles) {
    for (const recommendedSong of profile.recommended_songs) {
      await processRecommendedSong(config, recommendedSong, summary, searchSongsImpl);
    }
  }

  await writeProfiles(inputPath, profiles);
  return summary;
}

async function processRecommendedSong(
  config: Awaited<ReturnType<typeof loadConfig>>,
  recommendedSong: RecommendedSong,
  summary: SongProcessSummary,
  searchSongsImpl: typeof searchSongs,
): Promise<void> {
  try {
    const candidates = await searchSongsImpl(config, recommendedSong.artist, recommendedSong.title);
    const selected = selectBestMatch(recommendedSong, candidates);

    if (!selected) {
      recommendedSong.image_url = null;
      summary.failures.push({
        artist: recommendedSong.artist,
        title: recommendedSong.title,
        reason: "song not found",
      });
      return;
    }

    if (!selected.artworkUrl) {
      recommendedSong.image_url = null;
      summary.failures.push({
        artist: recommendedSong.artist,
        title: recommendedSong.title,
        reason: "artwork not found",
      });
      return;
    }

    const imageUrl = buildArtworkUrl(selected.artworkUrl);
    recommendedSong.image_url = imageUrl;
    summary.successes.push({
      artist: recommendedSong.artist,
      title: recommendedSong.title,
      imageUrl,
    });
  } catch (error) {
    recommendedSong.image_url = null;
    summary.failures.push({
      artist: recommendedSong.artist,
      title: recommendedSong.title,
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

function formatSummary(summary: SongProcessSummary): string {
  const lines = [
    `Successes: ${summary.successes.length}`,
    `Failures: ${summary.failures.length}`,
  ];

  for (const failure of summary.failures) {
    lines.push(`[FAILED] ${failure.artist} - ${failure.title}: ${failure.reason}`);
  }

  return lines.join("\n");
}

async function run(): Promise<void> {
  const currentFilePath = fileURLToPath(import.meta.url);
  const baseDir = path.resolve(path.dirname(currentFilePath), "..");
  const inputArg = process.argv[2] ?? path.join(baseDir, "input", "songs.json");
  const summary = await processSongsJson(baseDir, inputArg);
  console.log(formatSummary(summary));
}

const executedAsEntryPoint = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (executedAsEntryPoint) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

export { formatSummary };
