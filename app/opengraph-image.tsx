import { ImageResponse } from "next/og";

export const alt = "Heneris — Trouvez votre personal shopper";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Face = { name: string; data: ArrayBuffer; weight: 400 | 500 | 700; style: "normal" };

async function loadFont(
  family: string,
  weight: number,
): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());
    const url = css.match(/src: url\((https:\/\/[^)]+\.(?:woff2?|ttf))\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [playfair, inter] = await Promise.all([
    loadFont("Playfair+Display", 700),
    loadFont("Inter", 500),
  ]);

  // Polices Google indisponibles au build/runtime → repli sur la police
  // intégrée à next/og (Geist). L'image reste valide.
  const fonts: Face[] = [];
  if (playfair) fonts.push({ name: "Playfair", data: playfair, weight: 700, style: "normal" });
  if (inter) fonts.push({ name: "Inter", data: inter, weight: 500, style: "normal" });

  const serif = playfair ? "Playfair" : "serif";
  const sans = inter ? "Inter" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#17140E",
          padding: "72px 84px",
        }}
      >
        <div style={{ display: "flex", fontFamily: serif, fontSize: 64, color: "#FBFAF6" }}>
          HENERIS<span style={{ color: "#C9A84B" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontFamily: serif,
              fontSize: 68,
              lineHeight: 1.15,
              color: "#FBFAF6",
              maxWidth: 900,
            }}
          >
            Trouvez la bonne personne pour vous accompagner dans vos achats.
          </div>
          <div style={{ fontFamily: sans, fontSize: 28, color: "#C9A84B" }}>
            La marketplace des personal shoppers · tous budgets
          </div>
        </div>
      </div>
    ),
    fonts.length ? { ...size, fonts } : { ...size },
  );
}
