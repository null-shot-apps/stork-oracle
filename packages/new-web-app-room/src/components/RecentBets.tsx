'use client';

import { useEffect, useState } from 'react';

interface Bet {
  id: number;
  user: string;
  token: string;
  prediction: string;
  amount: number;
  odds: number;
  timestamp: Date;
}

const mockBets: Bet[] = [
  {
    id: 1,
    user: '0x1234...5678',
    token: 'STORK',
    prediction: 'Over $10.00',
    amount: 500,
    odds: 8.0,
    timestamp: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    id: 2,
    user: '0x9876...4321',
    token: 'STORK',
    prediction: '$1.00 - $5.00',
    amount: 250,
    odds: 3.2,
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 3,
    user: '0xabcd...efgh',
    token: 'ORC',
    prediction: 'Under $1.00',
    amount: 1000,
    odds: 1.8,
    timestamp: new Date(Date.now() - 8 * 60 * 1000)
  }
];

export default function RecentBets() {
  const [bets, setBets] = useState<Bet[]>(mockBets);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  useEffect(() => {
    // Simulate new bets coming in
    const interval = setInterval(() => {
      const newBet: Bet = {
        id: Date.now(),
        user: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
        token: Math.random() > 0.5 ? 'STORK' : 'ORC',
        prediction: ['Under $1.00', '$1.00 - $5.00', '$5.00 - $10.00', 'Over $10.00'][Math.floor(Math.random() * 4)],
        amount: Math.floor(Math.random() * 1000) + 50,
        odds: parseFloat((Math.random() * 10 + 1).toFixed(1)),
        timestamp: new Date()
      };
      
      setBets(prev => [newBet, ...prev.slice(0, 9)]); // Keep only 10 most recent
    }, 15000); // New bet every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold mb-4">Recent Bets</h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {bets.map((bet) => (
          <div key={bet.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-gray-400">{bet.user}</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  {bet.token}
                </span>
              </div>
              <span className="text-xs text-gray-400">{formatTimeAgo(bet.timestamp)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">{bet.prediction}</div>
                <div className="text-xs text-gray-400">
                  ${bet.amount} at {bet.odds}x odds
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-green-400">
                  ${(bet.amount * bet.odds).toFixed(0)}
                </div>
                <div className="text-xs text-gray-400">potential</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
