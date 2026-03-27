import { describe, expect, it } from "vitest";
import { parseCsv } from "../src/readInput.js";
describe("parseCsv", () => {
    it("parses valid rows and keeps explicit filenames", () => {
        const csv = [
            "artist_name,song_name,image_filename",
            '"Aimer","Brave Shine","brave-shine.jpg"',
            '"YOASOBI","アイドル",""',
        ].join("\n");
        expect(parseCsv(csv)).toEqual([
            {
                artistName: "Aimer",
                songName: "Brave Shine",
                imageFilename: "brave-shine.jpg",
            },
            {
                artistName: "YOASOBI",
                songName: "アイドル",
                imageFilename: undefined,
            },
        ]);
    });
    it("skips rows missing required columns", () => {
        const csv = ["artist_name,song_name", "Aimer,", ",Brave Shine"].join("\n");
        expect(parseCsv(csv)).toEqual([]);
    });
});
