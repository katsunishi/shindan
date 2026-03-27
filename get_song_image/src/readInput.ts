import { readFile, writeFile } from "node:fs/promises";

import type { SongProfile } from "./types.js";

export function parseProfilesJson(content: string): SongProfile[] {
  const parsed = JSON.parse(content) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("Input JSON must be an array");
  }

  return parsed.map((item) => {
    if (!item || typeof item !== "object") {
      throw new Error("Each profile must be an object");
    }

    const profile = item as Record<string, unknown>;
    if (!Array.isArray(profile.recommended_songs)) {
      throw new Error("Each profile must contain recommended_songs");
    }

    return profile as SongProfile;
  });
}

export async function readProfiles(filePath: string): Promise<SongProfile[]> {
  const content = await readFile(filePath, "utf8");
  return parseProfilesJson(content);
}

export async function writeProfiles(filePath: string, profiles: SongProfile[]): Promise<void> {
  const serialized = `${JSON.stringify(profiles, null, 2)}\n`;
  await writeFile(filePath, serialized, "utf8");
}
