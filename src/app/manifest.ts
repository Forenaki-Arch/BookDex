import type { MetadataRoute } from "next";

// Manifest PWA generato dinamicamente da Next
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BookDex — Il tuo tracker di libri",
    short_name: "BookDex",
    description: "Scansiona, cataloga e tieni traccia dei tuoi libri.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    categories: ["books", "education", "productivity"],
    lang: "it",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Scansiona ISBN",
        short_name: "Scanner",
        description: "Scansiona il codice a barre di un libro",
        url: "/app/search?scan=1",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Libreria",
        short_name: "Libreria",
        description: "Apri le tue liste",
        url: "/app",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
