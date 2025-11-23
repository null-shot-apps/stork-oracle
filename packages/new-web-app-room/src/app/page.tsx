'use client';

import { useEffect, useState } from 'react';
import LiveChart from '../components/LiveChart';
import RecentBets from '../components/RecentBets';
import Leaderboard from '../components/Leaderboard';

// Mock data for active token launches
const mockTokens = [
  {
    id: 1,
    name: "STORK",
    symbol: "STORK",
    launchTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    currentPrice: 0.0,
    predictions: {
      under1: { odds: 2.1, volume: 1250 },
      between1to5: { odds: 3.2, volume: 890 },
      between5to10: { odds: 4.5, volume: 650 },
      over10: { odds: 8.0, volume: 320 }
    },
    totalVolume: 3110
  },
  {
    id: 2,
    name: "ORACLE",
    symbol: "ORC",
    launchTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    currentPrice: 0.0,
    predictions: {
      under1: { odds: 1.8, volume: 2100 },
      between1to5: { odds: 2.9, volume: 1450 },
      between5to10: { odds: 5.2, volume: 780 },
      over10: { odds: 12.0, volume: 180 }
    },
    totalVolume: 4510
  }
];

export default function PredictionMarket() {
  const [selectedToken, setSelectedToken] = useState(mockTokens[0]);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState('');

  const formatTimeRemaining = (launchTime: Date) => {
    const now = new Date();
    const diff = launchTime.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(selectedToken.launchTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(selectedToken.launchTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedToken]);

  const placeBet = () => {
    if (!selectedPrediction || !betAmount) return;
    alert(`Bet placed: ${betAmount} on ${selectedPrediction} for ${selectedToken.symbol}`);
    setBetAmount('');
    setSelectedPrediction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Token Launch Predictions
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-300">
                Powered by Stork Oracle
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Token Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Active Token Launches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTokens.map((token) => (
              <div
                key={token.id}
                onClick={() => setSelectedToken(token)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedToken.id === token.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/20 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{token.name}</h3>
                    <p className="text-gray-400">${token.symbol}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Launches in</div>
                    <div className="font-mono text-lg text-green-400">
                      {token.id === selectedToken.id ? timeRemaining : formatTimeRemaining(token.launchTime)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Total Volume: ${token.totalVolume.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Chart and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <LiveChart tokenSymbol={selectedToken.symbol} />
          <RecentBets />
        </div>

        {/* Prediction Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Prediction Options */}
          <div className="xl:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Price Predictions for {selectedToken.symbol} (First 60 Minutes)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedToken.predictions).map(([key, prediction]) => {
                const labels = {
                  under1: 'Under $1.00',
                  between1to5: '$1.00 - $5.00',
                  between5to10: '$5.00 - $10.00',
                  over10: 'Over $10.00'
                };

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedPrediction(key)}
                    className={`p-6 rounded-xl border cursor-pointer transition-all ${
                      selectedPrediction === key
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-white/20 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg">{labels[key as keyof typeof labels]}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {prediction.odds}x
                        </div>
                        <div className="text-sm text-gray-400">odds</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Volume: ${prediction.volume.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Betting Panel */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/20 h-fit">
            <h3 className="text-lg font-semibold mb-4">Place Your Bet</h3>
            
            {selectedPrediction ? (
              <div className="space-y-4">
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="text-sm text-gray-400">Selected Prediction</div>
                  <div className="font-semibold">
                    {selectedPrediction === 'under1' && 'Under $1.00'}
                    {selectedPrediction === 'between1to5' && '$1.00 - $5.00'}
                    {selectedPrediction === 'between5to10' && '$5.00 - $10.00'}
                    {selectedPrediction === 'over10' && 'Over $10.00'}
                  </div>
                  <div className="text-green-400 font-bold">
                    {selectedToken.predictions[selectedPrediction as keyof typeof selectedToken.predictions].odds}x odds
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bet Amount ($)</label>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {betAmount && (
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="text-sm text-gray-400">Potential Payout</div>
                    <div className="text-xl font-bold text-purple-400">
                      ${(parseFloat(betAmount) * selectedToken.predictions[selectedPrediction as keyof typeof selectedToken.predictions].odds).toFixed(2)}
                    </div>
                  </div>
                )}

                <button
                  onClick={placeBet}
                  disabled={!betAmount}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Place Bet
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                Select a prediction to place your bet
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-white/20">
              <h4 className="font-semibold mb-2">How it works</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Predict the price after 60 minutes</li>
                <li>• Higher odds = higher risk/reward</li>
                <li>• Powered by Stork Oracle data</li>
                <li>• Instant payouts on results</li>
              </ul>
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}








