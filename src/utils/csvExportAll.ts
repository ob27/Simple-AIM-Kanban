import type { Kanban } from '../types';

function escapeCell(val: string): string {
  return `"${val.replace(/"/g, '""')}"`;
}

export function exportAllKanbansCSV(kanbans: Kanban[]): void {
  const rows: string[] = ['Board,Title,Status,Pill'];
  for (const k of kanbans) {
    const columnMap = Object.fromEntries(k.columns.map(c => [c.id, c.label]));
    const sorted = k.cards.slice().sort((a, b) => {
      const ai = k.columns.findIndex(c => c.id === a.columnId);
      const bi = k.columns.findIndex(c => c.id === b.columnId);
      return ai !== bi ? ai - bi : a.order - b.order;
    });
    for (const card of sorted) {
      rows.push([
        escapeCell(k.name),
        escapeCell(card.title),
        escapeCell(columnMap[card.columnId] ?? ''),
        escapeCell(card.pillValue ?? ''),
      ].join(','));
    }
  }
  const csv = rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'workspace-export.csv';
  a.click();
  URL.revokeObjectURL(url);
}
