'use client';

interface LeaderboardEntry {
  rank: number;
  user: string;
  totalWinnings: number;
  successRate: number;
  totalBets: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: '0x1a2b...3c4d',
    totalWinnings: 15420,
    successRate: 78,
    totalBets: 45
  },
  {
    rank: 2,
    user: '0x5e6f...7g8h',
    totalWinnings: 12890,
    successRate: 72,
    totalBets: 38
  },
  {
    rank: 3,
    user: '0x9i0j...1k2l',
    totalWinnings: 11250,
    successRate: 69,
    totalBets: 52
  },
  {
    rank: 4,
    user: '0x3m4n...5o6p',
    totalWinnings: 9870,
    successRate: 65,
    totalBets: 41
  },
  {
    rank: 5,
    user: '0x7q8r...9s0t',
    totalWinnings: 8450,
    successRate: 61,
    totalBets: 33
  }
];

export default function Leaderboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold mb-4">Top Predictors</h3>
      
      <div className="space-y-3">
        {mockLeaderboard.map((entry) => (
          <div key={entry.rank} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
              <div className="text-lg font-bold w-8 text-center">
                {getRankIcon(entry.rank)}
              </div>
              <div>
                <div className="font-mono text-sm">{entry.user}</div>
                <div className="text-xs text-gray-400">
                  {entry.totalBets} bets • {entry.successRate}% success
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-green-400">
                ${entry.totalWinnings.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">total winnings</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20 text-center">
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
          View Full Leaderboard →
        </button>
      </div>
    </div>
  );
}
