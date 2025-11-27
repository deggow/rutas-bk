import xlsx from "xlsx";
import fs from "fs";

// 1. Leer el archivo Excel
const workbook = xlsx.readFile("Hoja Ruta BK48-Chimbote.xlsx");

// 2. Obtener la hoja "Hoja Ruta"
const sheet = workbook.Sheets["Hoja Ruta"];
if (!sheet) {
  throw new Error('No se encontró la hoja "Hoja Ruta" en el Excel.');
}

// 3. Convertir la hoja a un arreglo de objetos JS
// Cada fila será un objeto: { Ruta, Cliente, Latitud, Longitud, ... }
const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

console.log(`Filas leídas en "Hoja Ruta": ${rows.length}`);

// 4. Agrupar por Ruta (BKxxxx)
const groupedByRuta = {};

for (const row of rows) {
  const ruta = row["Ruta"];       // ej. "BK4802"
  const cliente = row["Cliente"]; // nombre del cliente
  const lat = row["Latitud"];
  const lng = row["Longitud"];

  // Saltamos filas incompletas
  if (!ruta || lat == null || lng == null) continue;

  if (!groupedByRuta[ruta]) {
    groupedByRuta[ruta] = [];
  }

  groupedByRuta[ruta].push({
    cliente,
    latitud: lat,
    longitud: lng,
  });
}

// 5. Guardar el resultado en un archivo JSON
fs.writeFileSync(
  "rutas_por_BK.json",
  JSON.stringify(groupedByRuta, null, 2),
  "utf-8"
);

console.log('JSON generado: rutas_por_BK.json');