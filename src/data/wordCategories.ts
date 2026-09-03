import defaultCategoriesData from '../../server/categories.json';

export interface WordPair {
  civilianWord: string;
  imposterWord: string; // Used for "Undercover" mode where imposter gets a similar word, or hints
  hint?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  isCustom?: boolean;
  words: WordPair[];
}

export const DEFAULT_CATEGORIES: Category[] = defaultCategoriesData as Category[];

export const STORAGE_CUSTOM_CATEGORIES_KEY = 'imposter_custom_categories_v1';
export const STORAGE_SCORES_KEY = 'imposter_player_scores_v1';
export const STORAGE_PRESETS_KEY = 'imposter_player_presets_v1';
export const STORAGE_SETTINGS_KEY = 'imposter_game_settings_v1';
