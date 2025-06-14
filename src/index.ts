#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";

const SOURCE_DIR = path.join(__dirname, "contessa");
const TARGET_DIR = path.join(process.cwd(), "src", "contessa");

function copyDirectory(source: string, target: string) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);

  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

try {
  copyDirectory(SOURCE_DIR, TARGET_DIR);
  console.log("✅ Contessa boilerplates installed successfully!");
} catch (error) {
  console.error("❌ Error during installation:", error);
  process.exit(1);
}
