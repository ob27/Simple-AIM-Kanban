export interface ColumnConfig {
  id: string;
  label: string;
  color: string;
  description?: string;
}

export interface CardComment {
  id: string;
  uid: string;
  email: string;
  text: string;
  createdAt: number;
}

export interface KanbanCard {
  id: string;
  title: string;
  columnId: string;
  pillValue: string;
  order: number;
  notes?: string;
  comments?: CardComment[];
}

export interface Folder {
  id: string;
  name: string;
  ownerId: string;
  ownerEmail?: string;
  memberIds: string[];
  memberEmails: Record<string, string>;
  kanbanIds: string[];
  inviteToken: string;
  createdAt: number;
}

export interface Kanban {
  id: string;
  name: string;
  ownerId: string;
  memberIds: string[];
  inviteToken: string;
  columns: ColumnConfig[];
  totalEstimated: number;
  totalFromBacklog?: boolean;
  backlogColumnId?: string;
  groomedColumnId?: string;
  doneColumnId?: string;
  showProgressBar?: boolean;
  showLifeline?: boolean;
  showLogo?: boolean;
  showKanbanLogo?: boolean;
  kanbanLogoUrl?: string;
  cardFontSize?: number;
  ownerEmail?: string;
  coOwnerIds?: string[];
  viewerIds?: string[];
  memberEmails?: Record<string, string>;
  projectStartYear: number;
  projectStartMonth: number;
  projectEndYear: number;
  projectEndMonth: number;
  cards: KanbanCard[];
  createdAt: number;
}
