import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildArtworkUrl } from "./artwork.js";
import { loadConfig } from "./config.js";
import { readRecommendedSongs, writeRecommendedSongs } from "./readInput.js";
import { searchSongs } from "./searchSong.js";
import { selectBestMatch } from "./selectBestMatch.js";
import type { RecommendedSong, SongProcessSummary } from "./types.js";

export interface ProcessSongsDependencies {
  searchSongsImpl?: typeof searchSongs;
}

export async function processSongsJson(
  baseDir: string,
  inputPath: string,
  outputPath: string,
  dependencies: ProcessSongsDependencies = {},
): Promise<SongProcessSummary> {
  const config = await loadConfig(baseDir);
  const songsByType = await readRecommendedSongs(inputPath);
  const searchSongsImpl = dependencies.searchSongsImpl ?? searchSongs;

  const summary: SongProcessSummary = {
    successes: [],
    failures: [],
    updatedSongsByType: songsByType,
  };

  for (const [type, songs] of Object.entries(songsByType)) {
    for (const recommendedSong of songs) {
      await processRecommendedSong(type, config, recommendedSong, summary, searchSongsImpl);
    }
  }

  await writeRecommendedSongs(outputPath, songsByType);
  return summary;
}

async function processRecommendedSong(
  type: string,
  config: Awaited<ReturnType<typeof loadConfig>>,
  recommendedSong: RecommendedSong,
  summary: SongProcessSummary,
  searchSongsImpl: typeof searchSongs,
): Promise<void> {
  if (recommendedSong.image_url && recommendedSong.preview_url) {
    return;
  }

  try {
    const candidates = await searchSongsImpl(config, recommendedSong.artist, recommendedSong.title);
    const selected = selectBestMatch(recommendedSong, candidates);

    if (!selected) {
      summary.failures.push({
        type,
        artist: recommendedSong.artist,
        title: recommendedSong.title,
        reason: "song not found",
      });
      return;
    }

    const updatedFields: string[] = [];

    if (!recommendedSong.image_url && selected.artworkUrl) {
      recommendedSong.image_url = buildArtworkUrl(selected.artworkUrl);
      updatedFields.push("image");
    }

    if (!recommendedSong.preview_url && selected.previewUrl) {
      recommendedSong.preview_url = selected.previewUrl;
      updatedFields.push("preview");
    }

    if (updatedFields.length === 0) {
      summary.failures.push({
        type,
        artist: recommendedSong.artist,
        title: recommendedSong.title,
        reason: "image and preview not found",
      });
      return;
    }

    summary.successes.push({
      type,
      artist: recommendedSong.artist,
      title: recommendedSong.title,
      previewUrl: recommendedSong.preview_url ?? "",
    });
  } catch (error) {
    summary.failures.push({
      type,
      artist: recommendedSong.artist,
      title: recommendedSong.title,
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

function formatSummary(summary: SongProcessSummary, outputPath: string): string {
  const lines = [
    `Output: ${outputPath}`,
    `Successes: ${summary.successes.length}`,
    `Failures: ${summary.failures.length}`,
  ];

  for (const failure of summary.failures) {
    lines.push(`[FAILED] ${failure.type} / ${failure.artist} - ${failure.title}: ${failure.reason}`);
  }

  return lines.join("\n");
}

async function run(): Promise<void> {
  const currentFilePath = fileURLToPath(import.meta.url);
  const baseDir = path.resolve(path.dirname(currentFilePath), "..");
  const inputArg = process.argv[2] ?? path.join(baseDir, "results_recommended_songs.json");
  const outputArg = process.argv[3] ?? path.join(baseDir, "results_recommended_songs_with_preview.json");
  const summary = await processSongsJson(baseDir, inputArg, outputArg);
  console.log(formatSummary(summary, outputArg));
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
