import type { RecommendedSong, SongCandidate } from "./types.js";

function normalize(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s\-_.!?,/\\()[\]{}'"]/gu, "");
}

function scoreText(target: string, candidate: string): number {
  if (target === candidate) {
    return 100;
  }

  if (candidate.includes(target)) {
    return 80;
  }

  if (target.includes(candidate)) {
    return 70;
  }

  let score = 0;
  const targetChars = new Set(target);
  for (const char of candidate) {
    if (targetChars.has(char)) {
      score += 1;
    }
  }

  return Math.min(score, 60);
}

export function scoreCandidate(input: RecommendedSong, candidate: SongCandidate): number {
  const normalizedSong = normalize(input.title);
  const normalizedArtist = normalize(input.artist);
  const candidateSong = normalize(candidate.songName);
  const candidateArtist = normalize(candidate.artistName);

  return scoreText(normalizedSong, candidateSong) * 0.7 + scoreText(normalizedArtist, candidateArtist) * 0.3;
}

export function selectBestMatch(
  input: RecommendedSong,
  candidates: SongCandidate[],
  threshold = 60,
): SongCandidate | null {
  if (candidates.length === 0) {
    return null;
  }

  const scoredCandidates = candidates
    .map((candidate) => ({
      candidate,
      score: scoreCandidate(input, candidate),
    }))
    .sort((left, right) => right.score - left.score);

  const [best] = scoredCandidates;
  if (!best || best.score < threshold) {
    return null;
  }

  return best.candidate;
}

export { normalize };
