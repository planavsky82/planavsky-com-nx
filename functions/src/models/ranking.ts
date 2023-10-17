import { Player } from './player';

export interface RankingsData {
  players: Player[];
  type: 'QB' | 'RB' | 'WR' | 'TE' | 'DST' | 'K';
}

export interface Rankings {
  players: string[];
  type: 'QB' | 'RB' | 'WR' | 'TE' | 'DST' | 'K';
}
