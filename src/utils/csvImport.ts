import Papa from 'papaparse';
import type { KanbanCard, ColumnConfig } from '../types';

function longestCommonPrefixLen(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

function matchColumn(statusRaw: string, columns: ColumnConfig[]): ColumnConfig | undefined {
  const s = statusRaw.toLowerCase();
  const exact = columns.find(c => c.label.toLowerCase() === s);
  if (exact) return exact;
  const contained = columns.find(c =>
    c.label.toLowerCase().includes(s) || s.includes(c.label.toLowerCase())
  );
  if (contained) return contained;
  let best: ColumnConfig | undefined;
  let bestLen = 0;
  for (const c of columns) {
    const overlap = longestCommonPrefixLen(s, c.label.toLowerCase());
    if (overlap > bestLen) { bestLen = overlap; best = c; }
  }
  return bestLen >= 3 ? best : undefined;
}

export interface ImportResult {
  cards: KanbanCard[];
  skippedRows: number;
  errors: string[];
}

export function parseCSV(file: File, columns: ColumnConfig[]): Promise<ImportResult> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const cards: KanbanCard[] = [];
        let skippedRows = 0;
        const errors: string[] = [];

        for (const row of results.data) {
          try {
            const title = String(row['Title'] ?? row['DPK Number'] ?? '').trim();
            const statusRaw = String(row['Status'] ?? '').trim();
            const pillValue = String(row['Pill'] ?? row['Pill Value'] ?? '').trim();

            if (!title || !statusRaw) { skippedRows++; continue; }

            const col = matchColumn(statusRaw, columns);
            if (!col) { skippedRows++; continue; }

            cards.push({
              id: crypto.randomUUID(),
              title,
              columnId: col.id,
              pillValue,
              order: cards.length,
            });
          } catch {
            skippedRows++;
          }
        }

        resolve({ cards, skippedRows, errors });
      },
      error(err) {
        resolve({ cards: [], skippedRows: 0, errors: [err.message] });
      },
    });
  });
}
