import { readFile } from "node:fs/promises";
import path from "node:path";

import type { AppConfig } from "./types.js";

function parseEnv(content: string): Record<string, string> {
  const entries: Record<string, string> = {};

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^"(.*)"$/u, "$1");

    if (key) {
      entries[key] = value;
    }
  }

  return entries;
}

async function readEnv(baseDir: string): Promise<Record<string, string>> {
  const candidatePaths = [path.join(baseDir, ".env"), path.join(baseDir, "..", "get_song_image", ".env")];

  for (const envPath of candidatePaths) {
    try {
      const envContent = await readFile(envPath, "utf8");
      return parseEnv(envContent);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }

  return {};
}

export async function loadConfig(baseDir: string): Promise<AppConfig> {
  const fileEnv = await readEnv(baseDir);

  const appleMusicDeveloperToken =
    process.env.APPLE_MUSIC_DEVELOPER_TOKEN ?? fileEnv.APPLE_MUSIC_DEVELOPER_TOKEN;
  const storefront =
    process.env.APPLE_MUSIC_STOREFRONT ?? fileEnv.APPLE_MUSIC_STOREFRONT ?? "jp";

  if (!appleMusicDeveloperToken) {
    throw new Error(
      "Missing APPLE_MUSIC_DEVELOPER_TOKEN in get_songs_previewUrl/.env, get_song_image/.env, or environment variables",
    );
  }

  return {
    appleMusicDeveloperToken,
    storefront,
  };
}

export { parseEnv };
