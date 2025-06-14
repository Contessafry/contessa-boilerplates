const fs = require("fs");
const path = require("path");

// Percorso del progetto che sta installando il pacchetto
const projectRoot = process.cwd();
const targetDir = path.join(projectRoot, "src", "contessa");

// Percorso dei file da copiare
const sourceDir = path.join(__dirname, "..", "src", "contessa");

// Crea la directory di destinazione se non esiste
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Funzione per copiare ricorsivamente i file
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copia i file
try {
  copyDir(sourceDir, targetDir);
  console.log("✅ File copiati con successo in src/contessa");
} catch (error) {
  console.error("❌ Errore durante la copia dei file:", error);
  process.exit(1);
}
