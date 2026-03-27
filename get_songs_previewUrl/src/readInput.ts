import { readFile, writeFile } from "node:fs/promises";

import type { RecommendedSong, RecommendedSongsByType } from "./types.js";

function isRecommendedSong(value: unknown): value is RecommendedSong {
  if (!value || typeof value !== "object") {
    return false;
  }

  const song = value as Record<string, unknown>;
  return typeof song.artist === "string" && typeof song.title === "string";
}

export function parseRecommendedSongsJson(content: string): RecommendedSongsByType {
  const parsed = JSON.parse(content.replace(/^\uFEFF/u, "")) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Input JSON must be an object keyed by type");
  }

  const songsByType: RecommendedSongsByType = {};

  for (const [type, songs] of Object.entries(parsed)) {
    if (!Array.isArray(songs)) {
      throw new Error(`Type "${type}" must contain an array`);
    }

    if (!songs.every(isRecommendedSong)) {
      throw new Error(`Type "${type}" contains an invalid song entry`);
    }

    songsByType[type] = songs;
  }

  return songsByType;
}

export async function readRecommendedSongs(filePath: string): Promise<RecommendedSongsByType> {
  const content = await readFile(filePath, "utf8");
  return parseRecommendedSongsJson(content);
}

export async function writeRecommendedSongs(
  filePath: string,
  songsByType: RecommendedSongsByType,
): Promise<void> {
  const serialized = `${JSON.stringify(songsByType, null, 2)}\n`;
  await writeFile(filePath, serialized, "utf8");
}
