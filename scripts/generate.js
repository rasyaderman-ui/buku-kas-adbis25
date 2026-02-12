const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// GANTI nama file Excel kalau berbeda
const excelPath = path.join(__dirname, "..", "daftar nama adbis 25.xlsx");

// Baca file Excel
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Ubah ke JSON
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// Ambil kolom pertama (nama)
const namaList = data
  .map(row => row[0])
  .filter(nama => typeof nama === "string" && nama.trim() !== "")
  .map(nama => nama.trim().toUpperCase());

// Buat isi file mahasiswa.ts
const output = `export const mahasiswa = ${JSON.stringify(namaList, null, 2)};\n`;

// Tulis ke folder data
const outputPath = path.join(__dirname, "..", "data", "mahasiswa.ts");
fs.writeFileSync(outputPath, output);

console.log("✅ Berhasil membuat data/mahasiswa.ts dengan", namaList.length, "nama.");
