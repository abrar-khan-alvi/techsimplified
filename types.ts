export enum StoryStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum Region {
  GLOBAL = 'Global',
  NORTH_AMERICA = 'North America',
  EUROPE = 'Europe',
  ASIA_PACIFIC = 'Asia Pacific',
  LATIN_AMERICA = 'Latin America',
  AFRICA = 'Africa'
}

export enum Language {
  ENGLISH = 'English',
  SPANISH = 'Spanish',
  KOREAN = 'Korean',
  MANDARIN = 'Mandarin'
}

export type TranslationCache = {
  [key in Language]?: string;
}

export interface Story {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  region: Region;
  imageUrl: string;
  publishedAt: string; // ISO Date string
  
  // The simplified summary (default English)
  summary: string;
  
  // Translations cached for this story
  translations: TranslationCache;
  
  status: StoryStatus;
  
  // Admin fields
  originalTextSnippet?: string; // The raw text used to generate the summary
  topics: string[];
  likes: number;
}

export interface StoryFilter {
  region?: Region;
  searchQuery: string;
}