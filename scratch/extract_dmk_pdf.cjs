#!/usr/bin/env node
/**
 * DMK Manifesto PDF → JSON Extractor
 * ====================================
 * Internal tool to extract promises from a manifesto PDF and convert to
 * the app's data/promises.json format.
 *
 * Usage:
 *   node scratch/extract_dmk_pdf.cjs <pdf-path> [options]
 *
 * Options:
 *   --output <file>      Output JSON file (default: data/dmk-promises.json)
 *   --party <id>         Party ID (default: dmk)
 *   --election <year>    Election year (default: 2021)
 *   --go-map <file>      JSON file mapping promise IDs to GO numbers/status overrides
 *   --start-index <n>    Starting promise number (default: 1)
 *   --dry-run            Print extracted text + sections without writing JSON
 *   --raw                Dump raw extracted PDF text to stdout and exit
 *
 * Status logic:
 *   - Default: "in-progress"  (manifesto promise assumed being worked on)
 *   - GO pattern found in text: "fulfilled"
 *   - Overridden via --go-map: uses map value
 *
 * GO patterns detected (Tamil Nadu GOs):
 *   G.O.Ms.No  |  G.O.(Ms)No  |  G.O.Rt.No  |  G.O.(Rt)No
 *
 * GO Map file format (scratch/go_map_template.json):
 *   {
 *     "dmk-001": { "status": "fulfilled", "goNumber": "G.O.Ms.No. 123", "goUrl": "https://..." },
 *     "dmk-005": { "status": "stalled", "note": "Partially implemented" }
 *   }
 *
 * Example:
 *   node scratch/extract_dmk_pdf.cjs ./dmk-manifesto-2021.pdf --go-map scratch/go_map.json
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Argument parsing ────────────────────────────────────────────────────────

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
Usage: node scratch/extract_dmk_pdf.cjs <pdf-path> [options]

Options:
  --output <file>      Output JSON file (default: data/dmk-promises.json)
  --party <id>         Party ID (default: dmk)
  --election <year>    Election year (default: 2021)
  --go-map <file>      JSON mapping file for GO/status overrides
  --start-index <n>    Starting promise number (default: 1)
  --dry-run            Show extracted sections without writing JSON
  --raw                Dump raw PDF text and exit

Example:
  node scratch/extract_dmk_pdf.cjs dmk-manifesto-2021.pdf --go-map scratch/go_map.json
`);
  process.exit(0);
}

const pdfPath     = args[0];
const outputFile  = argVal('--output')      ?? 'data/dmk-promises.json';
const partyId     = argVal('--party')       ?? 'dmk';
const electionYr  = parseInt(argVal('--election') ?? '2021', 10);
const goMapFile   = argVal('--go-map');
const startIndex  = parseInt(argVal('--start-index') ?? '1', 10);
const isDryRun    = args.includes('--dry-run');
const isRaw       = args.includes('--raw');

function argVal(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

// ─── Sector definitions ───────────────────────────────────────────────────────
// Keyword → sector mapping. Keywords are matched against section heading text.

const SECTORS = [
  {
    id: 's1', name: 'Agriculture', nameTa: 'வேளாண்மை', icon: 'wheat', color: '#65A30D',
    keywords: ['agricultur', 'farmer', 'farm', 'crop', 'irrigation', 'fisheri', 'fishing', 'horticultur', 'livestock', 'dairy', 'cattle', 'poultry', 'வேளாண்', 'விவசாய', 'மீனவ', 'தோட்டக்']
  },
  {
    id: 's2', name: 'Education', nameTa: 'கல்வி', icon: 'graduation-cap', color: '#0EA5E9',
    keywords: ['education', 'school', 'college', 'university', 'student', 'teacher', 'scholarship', 'midday meal', 'கல்வி', 'பள்ளி', 'கல்லூரி', 'மாணவர்']
  },
  {
    id: 's3', name: 'Healthcare', nameTa: 'சுகாதாரம்', icon: 'heart-pulse', color: '#EF4444',
    keywords: ['health', 'hospital', 'medical', 'doctor', 'nurse', 'medicine', 'insurance', 'கட்டண', 'மருத்துவ', 'ஆரோக்கிய', 'மருந்து']
  },
  {
    id: 's4', name: 'Social Security', nameTa: 'சமூக பாதுகாப்பு', icon: 'shield', color: '#8B5CF6',
    keywords: ['social', 'welfare', 'pension', 'ration', 'pds', 'subsidy', 'old age', 'disabled', 'differently', 'சமூக', 'நலன்', 'ஓய்வூதிய', 'இலவச']
  },
  {
    id: 's5', name: 'Women & Child', nameTa: 'பெண்கள் & குழந்தை', icon: 'users', color: '#EC4899',
    keywords: ['women', 'woman', 'girl', 'child', 'mother', 'maternal', 'பெண்', 'குழந்தை', 'தாய்']
  },
  {
    id: 's6', name: 'Employment', nameTa: 'வேலைவாய்ப்பு', icon: 'briefcase', color: '#F59E0B',
    keywords: ['employ', 'job', 'work', 'labour', 'worker', 'skill', 'training', 'வேலை', 'தொழிலாளர்', 'தொழில்']
  },
  {
    id: 's7', name: 'Infrastructure', nameTa: 'உள்கட்டமைப்பு', icon: 'building', color: '#6B7280',
    keywords: ['road', 'bridge', 'transport', 'bus', 'metro', 'rail', 'highway', 'infrastructure', 'housing', 'சாலை', 'பாலம்', 'போக்குவரத்து', 'வீட்டுவசதி']
  },
  {
    id: 's8', name: 'Environment', nameTa: 'சுற்றுச்சூழல்', icon: 'leaf', color: '#10B981',
    keywords: ['environment', 'forest', 'tree', 'green', 'climate', 'solar', 'energy', 'water', 'சுற்றுச்சூழல்', 'மரம்', 'சூரிய', 'ஆற்றல்']
  },
  {
    id: 's9', name: 'Economy & Industry', nameTa: 'பொருளாதாரம்', icon: 'trending-up', color: '#0F766E',
    keywords: ['industry', 'industri', 'business', 'trade', 'commerce', 'msme', 'small enterprise', 'invest', 'தொழில்துறை', 'வர்த்தக']
  },
  {
    id: 's10', name: 'Governance', nameTa: 'ஆட்சி', icon: 'landmark', color: '#1D4ED8',
    keywords: ['governance', 'government', 'administration', 'police', 'law', 'justice', 'corruption', 'ஆட்சி', 'நீதி', 'காவல்']
  },
  {
    id: 's11', name: 'Tamil Culture', nameTa: 'தமிழ் பண்பாடு', icon: 'book-open', color: '#7C3AED',
    keywords: ['tamil', 'culture', 'language', 'literature', 'art', 'heritage', 'தமிழ்', 'பண்பாடு', 'மொழி', 'கலை']
  },
  {
    id: 's12', name: 'Youth & Sports', nameTa: 'இளைஞர் & விளையாட்டு', icon: 'trophy', color: '#D97706',
    keywords: ['youth', 'sport', 'stadium', 'game', 'இளைஞர்', 'விளையாட்டு']
  },
];

const DEFAULT_SECTOR = {
  id: 's0', name: 'General', nameTa: 'பொது', icon: 'file-text', color: '#6B7280'
};

// ─── GO detection patterns ────────────────────────────────────────────────────

const GO_PATTERNS = [
  /G\.O\.\(Ms\)\s*No\.\s*\d+/gi,
  /G\.O\.\s*Ms\.\s*No\.\s*\d+/gi,
  /G\.O\.\(Rt\)\s*No\.\s*\d+/gi,
  /G\.O\.\s*Rt\.\s*No\.\s*\d+/gi,
  /G\.O\.\s*No\.\s*\d+/gi,
  /Government Order No\.\s*\d+/gi,
];

function detectGoNumbers(text) {
  const found = [];
  for (const pattern of GO_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) found.push(...matches);
  }
  return [...new Set(found)];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80);
}

function padNum(n) {
  return String(n).padStart(3, '0');
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function detectSector(text) {
  const lower = text.toLowerCase();
  for (const sector of SECTORS) {
    if (sector.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return { id: sector.id, name: sector.name, nameTa: sector.nameTa, icon: sector.icon, color: sector.color };
    }
  }
  return { ...DEFAULT_SECTOR };
}

// Detect if a line looks like a section heading
function isSectionHeading(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length < 3) return false;
  
  // All-caps heading (English)
  if (/^[A-Z\s&\/\-,]{5,}$/.test(trimmed) && trimmed.length < 80) return true;
  // Numbered chapter: "1.", "Chapter 1", "CHAPTER I", "பகுதி 1"
  if (/^(chapter|part|section|பகுதி|அத்தியாயம்)\s*[\dIVXivx]+/i.test(trimmed)) return true;
  // Short bold-like lines ending without period (likely heading)
  if (trimmed.length < 60 && !trimmed.endsWith('.') && /^[A-Z]/.test(trimmed) && !/^\d+\./.test(trimmed)) return true;
  
  return false;
}

// Detect if a line is a numbered promise item
function isPromiseLine(line) {
  const trimmed = line.trim();
  // Matches: "1.", "1)", "•", "-", "✓", or Tamil numbering
  return /^(\d+[\.\)]\s+|[•\-\*✓►]\s*|[அ-ஔ]+[\.\)]\s*)/.test(trimmed) && trimmed.length > 10;
}

// Extract promise text (strip leading number/bullet)
function extractPromiseText(line) {
  return line.trim().replace(/^(\d+[\.\)]\s*|[•\-\*✓►]\s*|[அ-ஔ]+[\.\)]\s*)/, '').trim();
}

// ─── Main PDF parsing logic ───────────────────────────────────────────────────

async function extractFromPdf(pdfBuffer) {
  let pdfParse;
  try {
    pdfParse = require('pdf-parse');
  } catch {
    console.error('Error: pdf-parse not installed. Run: npm install pdf-parse --save-dev');
    process.exit(1);
  }

  const data = await pdfParse(pdfBuffer);
  return data.text;
}

function parsePromisesFromText(text) {
  const lines = text.split('\n').map(l => l.replace(/\r/g, ''));
  const sections = [];
  let currentSection = { heading: 'General', lines: [] };

  for (const line of lines) {
    if (isSectionHeading(line)) {
      if (currentSection.lines.length > 0) {
        sections.push({ ...currentSection });
      }
      currentSection = { heading: line.trim(), lines: [] };
    } else {
      currentSection.lines.push(line);
    }
  }
  if (currentSection.lines.length > 0) sections.push(currentSection);

  const promises = [];
  let counter = startIndex;

  for (const section of sections) {
    const sectorObj = detectSector(section.heading + ' ' + section.lines.join(' '));
    const sectionText = section.lines.join(' ');

    // Method 1: Detect explicit numbered/bulleted items
    const explicitItems = section.lines.filter(isPromiseLine);

    // Method 2: If no explicit bullets, treat every non-blank line as a potential promise
    // (useful for dense manifesto text blocks)
    const itemsToProcess = explicitItems.length > 0
      ? explicitItems
      : section.lines.filter(l => l.trim().length > 30);

    for (const item of itemsToProcess) {
      const itemText = explicitItems.length > 0 ? extractPromiseText(item) : item.trim();
      if (!itemText || itemText.length < 15) continue;

      // Look for GO numbers in a window around this item
      const itemIdx = section.lines.indexOf(item);
      const contextWindow = section.lines
        .slice(Math.max(0, itemIdx - 2), Math.min(section.lines.length, itemIdx + 5))
        .join(' ');
      const goNumbers = detectGoNumbers(contextWindow);

      const status = goNumbers.length > 0 ? 'fulfilled' : 'in-progress';
      const id = `${partyId}-${padNum(counter)}`;
      const title = itemText.slice(0, 120).replace(/\s+/g, ' ');
      const slug = slugify(title) || id;

      const promise = {
        id,
        slug,
        partyId,
        title,
        titleTa: '',
        description: itemText.replace(/\s+/g, ' ').slice(0, 500),
        trackingNote: goNumbers.length > 0
          ? `GO found: ${goNumbers.join(', ')}. Verify via TN e-Governance portal.`
          : null,
        manifestoQuote: itemText.split('.')[0].slice(0, 200) || itemText.slice(0, 200),
        sector: sectorObj,
        status,
        icon: sectorObj.icon,
        sources: [
          {
            title: `DMK Manifesto ${electionYr}`,
            url: `https://dmk.in/manifesto-${electionYr}`,
            publication: 'DMK Official',
            date: `${electionYr}-03-01`,
            tier: 1,
            summary: `Original manifesto promise (${electionYr} election).`
          }
        ],
        lastUpdated: today(),
        createdAt: today(),
      };

      promises.push(promise);
      counter++;
    }
  }

  return { sections, promises };
}

// Apply overrides from --go-map file
function applyGoMap(promises, goMapFile) {
  if (!goMapFile) return promises;

  let goMap;
  try {
    goMap = JSON.parse(fs.readFileSync(goMapFile, 'utf8'));
  } catch (e) {
    console.warn(`⚠ Could not read --go-map file: ${e.message}`);
    return promises;
  }

  let overrideCount = 0;
  for (const promise of promises) {
    if (goMap[promise.id]) {
      const override = goMap[promise.id];
      if (override.status) promise.status = override.status;
      if (override.goNumber) {
        promise.trackingNote = `GO: ${override.goNumber}${override.goUrl ? ' — ' + override.goUrl : ''}`;
        if (override.goUrl) {
          promise.sources.push({
            title: `Government Order: ${override.goNumber}`,
            url: override.goUrl,
            publication: 'TN Government Gazette',
            date: override.goDate ?? today(),
            tier: 1,
            summary: `Official Government Order fulfilling this manifesto promise.`
          });
        }
      }
      if (override.note) promise.trackingNote = override.note;
      overrideCount++;
    }
  }

  console.log(`✓ Applied ${overrideCount} GO map override(s).`);
  return promises;
}

// ─── Entry point ──────────────────────────────────────────────────────────────

(async () => {
  if (!fs.existsSync(pdfPath)) {
    console.error(`Error: PDF not found at "${pdfPath}"`);
    process.exit(1);
  }

  console.log(`\n📄 Reading PDF: ${pdfPath}`);
  const pdfBuffer = fs.readFileSync(pdfPath);

  console.log('🔍 Extracting text...');
  const rawText = await extractFromPdf(pdfBuffer);

  if (isRaw) {
    console.log('\n─── RAW EXTRACTED TEXT ───────────────────────────────────────\n');
    console.log(rawText);
    process.exit(0);
  }

  console.log(`✓ Extracted ${rawText.length.toLocaleString()} characters.`);

  console.log('⚙  Parsing promises...');
  const { sections, promises: rawPromises } = parsePromisesFromText(rawText);

  if (isDryRun) {
    console.log('\n─── DETECTED SECTIONS ────────────────────────────────────────\n');
    for (const s of sections) {
      const sector = detectSector(s.heading + ' ' + s.lines.join(' '));
      const itemCount = s.lines.filter(isPromiseLine).length || s.lines.filter(l => l.trim().length > 30).length;
      console.log(`  [${sector.name.padEnd(20)}] ${s.heading.slice(0, 60)} (${itemCount} items)`);
    }
    console.log(`\n─── SAMPLE PROMISES (first 10) ───────────────────────────────\n`);
    rawPromises.slice(0, 10).forEach(p => {
      console.log(`  ${p.id}  [${p.status}]  ${p.title.slice(0, 80)}`);
    });
    console.log(`\n  Total promises extracted: ${rawPromises.length}`);
    console.log('\n  Run without --dry-run to write to file.\n');
    process.exit(0);
  }

  const promises = applyGoMap(rawPromises, goMapFile);

  // Merge with existing data/dmk-promises.json if present (avoid duplicates)
  const outputPath = path.resolve(process.cwd(), outputFile);
  let existing = [];
  if (fs.existsSync(outputPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log(`ℹ  Found ${existing.length} existing entries in ${outputFile}.`);
    } catch { /* empty / corrupt file, start fresh */ }
  }

  // Merge: keep existing entries not overlapping by id
  const existingIds = new Set(existing.map(p => p.id));
  const newPromises = promises.filter(p => !existingIds.has(p.id));
  const merged = [...existing, ...newPromises];

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf8');

  // Print summary
  const fulfilled = promises.filter(p => p.status === 'fulfilled').length;
  const inProgress = promises.filter(p => p.status === 'in-progress').length;

  console.log(`\n✅ Done!`);
  console.log(`   New promises extracted : ${newPromises.length}`);
  console.log(`   Total in output file   : ${merged.length}`);
  console.log(`   Status — fulfilled     : ${fulfilled}`);
  console.log(`   Status — in-progress   : ${inProgress}`);
  console.log(`   Output file            : ${outputPath}`);
  console.log(`\n⚠  Review the output and fill in:`);
  console.log(`   • titleTa (Tamil title)`);
  console.log(`   • sector (auto-detected, may need correction)`);
  console.log(`   • trackingNote (for fulfilled/stalled entries)\n`);
})();
