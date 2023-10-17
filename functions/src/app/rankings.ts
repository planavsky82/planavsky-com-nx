import { Rankings, RankingsData } from '../models/ranking';
import { Player } from '../models/player';

export class PlayerRankings {
  public completeRankings: Rankings[] = [];

  constructor(userRankings: Rankings[], baseRankings: RankingsData[]) {
    this.completeRankings = this.createRankings(userRankings, baseRankings);
  }

  private createRankings = (userRankings: Rankings[], baseRankings: RankingsData[]): Rankings[] => {
    let completeRankings: Rankings[] = [];
    baseRankings.forEach((rankings: RankingsData) => {
      if (rankings.players) {
        let baseRankingIDs = rankings.players.map((player: Player) => {
          return player.id;
        });
        let userPositionRanking = userRankings.find((userRanking: Rankings) => {
          return userRanking.type === rankings.type;
        });
        if (userPositionRanking) {
          let completePositionRankings: string[] = Array.from(new Set(userPositionRanking.players.concat(baseRankingIDs)));
          completeRankings.push({
            type: rankings.type,
            players: completePositionRankings
          });
        }
      }
    });
    return completeRankings;
  }
}
