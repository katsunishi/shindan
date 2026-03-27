import { describe, expect, it } from "vitest";

import { parseProfilesJson } from "../src/readInput.js";

describe("parseProfilesJson", () => {
  it("parses profile arrays with recommended songs", () => {
    const json = JSON.stringify([
      {
        type: "ENTJ",
        recommended_songs: [
          {
            artist: "Kanye West",
            title: "POWER",
          },
        ],
      },
    ]);

    expect(parseProfilesJson(json)).toEqual([
      {
        type: "ENTJ",
        recommended_songs: [
          {
            artist: "Kanye West",
            title: "POWER",
          },
        ],
      },
    ]);
  });
});
