import fs from "fs";
import path from "path";

// 1. Load the JSON previously generated
const rutas = JSON.parse(fs.readFileSync("rutas_por_BK.json", "utf-8"));

// 2. Create /public if it doesn't exist
const outDir = path.join(process.cwd(), "public");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// 3. Convert each BK into its own GeoJSON file
for (const [bk, puntos] of Object.entries(rutas)) {
  const features = puntos.map((p, index) => ({
    type: "Feature",
    properties: {
      seq: index + 1,
      cliente: p.cliente,
    },
    geometry: {
      type: "Point",
      coordinates: [p.longitud, p.latitud], // [lng, lat]
    },
  }));

  const geojson = {
    type: "FeatureCollection",
    features,
  };

  const outPath = path.join(outDir, `${bk}.geojson`);
  fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2));

  console.log(`✔ Generated GeoJSON for ${bk}: ${outPath}`);
}

console.log("All GeoJSONs completed!");
