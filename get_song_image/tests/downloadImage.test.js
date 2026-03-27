import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildArtworkUrl, buildOutputFilename, downloadImage } from "../src/downloadImage.js";
const tempDirs = [];
afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});
describe("downloadImage helpers", () => {
    it("builds artwork urls with concrete dimensions", () => {
        expect(buildArtworkUrl("https://example.com/{w}x{h}bb.jpg")).toBe("https://example.com/1000x1000bb.jpg");
    });
    it("builds sanitized output filenames", () => {
        expect(buildOutputFilename("Aimer", "Brave/Shine")).toBe("Aimer_Brave_Shine.jpg");
    });
    it("downloads binary data to the target directory", async () => {
        const tempDir = await mkdtemp(path.join(os.tmpdir(), "song-image-test-"));
        tempDirs.push(tempDir);
        const fetchMock = async () => new Response(Uint8Array.from([1, 2, 3]), {
            status: 200,
        });
        const outputPath = await downloadImage("https://example.com/image.jpg", tempDir, "image.jpg", fetchMock);
        const saved = await readFile(outputPath);
        expect(saved).toEqual(Buffer.from([1, 2, 3]));
    });
});
