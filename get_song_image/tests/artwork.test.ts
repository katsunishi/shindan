import { describe, expect, it } from "vitest";

import { buildArtworkUrl } from "../src/artwork.js";

describe("buildArtworkUrl", () => {
  it("builds artwork urls with concrete dimensions", () => {
    expect(buildArtworkUrl("https://example.com/{w}x{h}bb.jpg")).toBe("https://example.com/1000x1000bb.jpg");
  });
});
