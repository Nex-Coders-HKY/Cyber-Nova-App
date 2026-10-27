// Usage: node scripts/import-students.mjs path/to/students.xlsx [--dry-run]
// Expected columns: certificate_id, student_name, course_name, issue_date (MM/DD/YYYY or a real date).
// crypto_hash is ignored. Existing certificates are NOT overwritten, so revoked status is kept.
// Needs service-account.json in the project root (gitignored) or FIREBASE_SERVICE_ACCOUNT_PATH.
import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import XLSX from 'xlsx';

const file = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
if (!file) {
  console.error('Usage: node scripts/import-students.mjs <file.xlsx> [--dry-run]');
  process.exit(1);
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function formatDate(value) {
  let y, m, d;
  if (value instanceof Date) {
    y = value.getUTCFullYear(); m = value.getUTCMonth() + 1; d = value.getUTCDate();
  } else {
    const match = String(value).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return String(value).trim();
    m = Number(match[1]); d = Number(match[2]); y = Number(match[3]);
  }
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'service-account.json';
const app = initializeApp({ credential: cert(JSON.parse(readFileSync(saPath, 'utf8'))) });
const db = getFirestore(app);

const wb = XLSX.readFile(file, { cellDates: true });
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });

const records = [];
const problems = [];
const seen = new Set();

rows.forEach((r, i) => {
  const line = i + 2; // +2: header row + 1-based numbering
  const id = String(r.certificate_id ?? '').trim();
  const holderName = String(r.student_name ?? '').trim();
  const courseTitle = String(r.course_name ?? '').trim();
  if (!/^[A-Za-z0-9-]{4,60}$/.test(id) || !holderName || !courseTitle) {
    problems.push(`Row ${line}: missing or invalid data (${id || 'no ID'})`);
    return;
  }
  if (seen.has(id)) {
    problems.push(`Row ${line}: duplicate ID ${id} in file`);
    return;
  }
  seen.add(id);
  records.push({ id, data: { holderName, courseTitle, issuedOn: formatDate(r.issue_date), status: 'valid' } });
});

let created = 0;
let skipped = 0;
const col = db.collection('certificates');

for (let i = 0; i < records.length; i += 300) {
  const chunk = records.slice(i, i + 300);
  const snaps = await db.getAll(...chunk.map((r) => col.doc(r.id)));
  const batch = db.batch();
  snaps.forEach((snap, idx) => {
    if (snap.exists) { skipped++; return; }
    created++;
    if (!dryRun) batch.create(col.doc(chunk[idx].id), chunk[idx].data);
  });
  if (!dryRun) await batch.commit();
}

console.log(`${dryRun ? 'Dry run: would create' : 'Created'} ${created} certificate(s). Already existed (kept as-is): ${skipped}.`);
problems.forEach((p) => console.warn(p));
process.exit(0);
