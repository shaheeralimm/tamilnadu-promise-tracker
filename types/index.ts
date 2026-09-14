export type Status =
  | 'fulfilled'
  | 'modified'
  | 'in-progress'
  | 'stalled'
  | 'not-fulfilled'
  | 'evaded'
  | 'pending';

export type SourceTier = 1 | 2 | 3;

export type PartyStatus = 'active' | 'historical';

export interface Party {
  id: string;
  name: string;
  nameTa: string;
  shortName: string;
  color: string;            // Primary brand color hex
  electionYear: number;
  cmName: string;
  manifestoUrl: string;
  status: PartyStatus;
}

export interface Promise {
  id: string;
  slug: string;
  partyId: string;          // References Party.id
  title: string;
  titleTa: string;
  description: string;
  trackingNote?: string | null;
  manifestoQuote: string;
  sector: Sector;
  status: Status;
  icon: string;
  sources: Source[];
  lastUpdated: string; // ISO date
  createdAt: string;
}

export interface Source {
  title: string;
  url: string;
  archiveUrl?: string; // Fallback web archive link (Wayback Machine / archive.today)
  publication: string;
  date: string;
  tier: SourceTier;
  summary: string;
}

export interface Sector {
  id: string;
  name: string;
  nameTa: string;
  icon: string;
  color: string;
}
