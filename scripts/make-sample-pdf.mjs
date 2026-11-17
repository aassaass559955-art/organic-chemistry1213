import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const lines = [
  "Organic Chemistry Platform",
  "Sample document - publications by researcher Murtada Awad",
  "This placeholder file demonstrates the platform download system.",
  "Upload your real PDF / DOCX / PPTX / ZIP files from the admin dashboard.",
];

const content = [
  "BT /F1 20 Tf 56 740 Td",
  `(${escapePdf(lines[0])}) Tj ET`,
  "BT /F1 12 Tf 56 705 Td",
  ...lines.slice(1).map((l, i) => `(${escapePdf(l)}) Tj 0 -22 Td`),
  "ET",
].join("\n");

function escapePdf(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
  `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
];

let pdf = "%PDF-1.4\n";
const offsets = [0];
objects.forEach((body, i) => {
  offsets.push(pdf.length);
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});
const xrefPos = pdf.length;
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objects.length; i++) {
  pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

mkdirSync(join(process.cwd(), "public", "uploads"), { recursive: true });
writeFileSync(join(process.cwd(), "public", "uploads", "sample-research.pdf"), pdf, "binary");
console.log("sample-research.pdf written:", pdf.length, "bytes");
