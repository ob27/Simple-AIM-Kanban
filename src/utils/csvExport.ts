import type { Kanban } from '../types';

function escapeCell(val: string): string {
  return `"${val.replace(/"/g, '""')}"`;
}

export function exportKanbanCSV(kanban: Kanban): void {
  const columnMap = Object.fromEntries(kanban.columns.map(c => [c.id, c.label]));
  const rows = kanban.cards
    .slice()
    .sort((a, b) => {
      const ai = kanban.columns.findIndex(c => c.id === a.columnId);
      const bi = kanban.columns.findIndex(c => c.id === b.columnId);
      return ai !== bi ? ai - bi : a.order - b.order;
    })
    .map(card => [
      escapeCell(card.title),
      escapeCell(columnMap[card.columnId] ?? ''),
      escapeCell(card.pillValue ?? ''),
    ].join(','));

  const csv = ['Title,Status,Pill', ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${kanban.name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
