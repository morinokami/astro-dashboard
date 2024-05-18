import db from "@astrojs/db";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import simpleStackStream from "simple-stack-stream";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [db(), react(), simpleStackStream(), tailwind()],
  experimental: {
    actions: true,
  },
});
