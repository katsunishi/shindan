import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoBase = "/shindan";
const resultTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP"
];
const staticRoutes = ["/types", ...resultTypes.map((type) => `/result/${type}`)];
const currentDir = path.dirname(fileURLToPath(import.meta.url));

function createRouteRedirectPlugin() {
  return {
    name: "create-route-redirect-pages",
    async closeBundle() {
      const outDir = path.resolve(currentDir, "docs");

      await Promise.all(
        staticRoutes.map(async (routePath) => {
          const targetDir = path.join(outDir, routePath.replace(/^\//, ""));
          const html = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=${repoBase}/?p=${encodeURIComponent(routePath)}" />
    <script>
      window.location.replace("${repoBase}/?p=${encodeURIComponent(routePath)}");
    </script>
  </head>
  <body></body>
</html>
`;

          await mkdir(targetDir, { recursive: true });
          await writeFile(path.join(targetDir, "index.html"), html, "utf8");
        })
      );
    }
  };
}

export default defineConfig({
  base: `${repoBase}/`,
  build: {
    outDir: "docs",
    emptyOutDir: true
  },
  plugins: [react(), createRouteRedirectPlugin()]
});
