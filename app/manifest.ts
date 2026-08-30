import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Heneris",
    short_name: "Heneris",
    description:
      "La marketplace qui met en relation personal shoppers et clients, quel que soit le budget.",
    start_url: "/",
    display: "standalone",
    lang: "fr",
    background_color: "#fbfaf6",
    theme_color: "#17140e",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/brand/favicon.svg", type: "image/svg+xml", sizes: "any" },
    ],
  };
}
