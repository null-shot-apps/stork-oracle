'use client';

import { useEffect, useState } from 'react';
import LiveChart from '../components/LiveChart';
import RecentBets from '../components/RecentBets';
import Leaderboard from '../components/Leaderboard';
import SignUp from '../components/SignUp';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{email: string, username: string} | null>(null);
  const [selectedToken, setSelectedToken] = useState(mockTokens[0]);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [customTokenInput, setCustomTokenInput] = useState('');
  const [customToken, setCustomToken] = useState<any>(null);

  // Check for existing user session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('stork_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignUp = (email: string, username: string) => {
    const userData = { email, username, joinedAt: new Date().toISOString() };
    localStorage.setItem('stork_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('stork_user');
    setUser(null);
    setIsAuthenticated(false);
  };

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

  const handleCustomTokenSubmit = () => {
    if (!customTokenInput.trim()) return;
    
    // Create a new token object from the input
    const newCustomToken = {
      id: 999,
      name: customTokenInput.length > 20 ? customTokenInput.substring(0, 20) + '...' : customTokenInput,
      symbol: customTokenInput.startsWith('0x') ? 'CUSTOM' : customTokenInput.toUpperCase(),
      contractAddress: customTokenInput.startsWith('0x') ? customTokenInput : null,
      launchTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      currentPrice: 0.0,
      predictions: {
        under1: { odds: 2.5, volume: 0 },
        between1to5: { odds: 3.0, volume: 0 },
        between5to10: { odds: 4.0, volume: 0 },
        over10: { odds: 6.0, volume: 0 }
      },
      totalVolume: 0,
      isCustom: true
    };
    
    setCustomToken(newCustomToken);
    setSelectedToken(newCustomToken);
    setCustomTokenInput('');
  };

  // Show sign-up form if not authenticated
  if (!isAuthenticated) {
    return <SignUp onSignUp={handleSignUp} />;
  }

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
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <span className="text-gray-400">Welcome,</span>
                  <span className="text-white font-medium ml-1">{user?.username}</span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Custom Token Input */}
        <div className="mb-8">
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create Prediction Market
            </h2>
            <p className="text-gray-300 mb-4">
              Enter a token contract address or symbol to create a new prediction market
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={customTokenInput}
                onChange={(e) => setCustomTokenInput(e.target.value)}
                placeholder="0x... contract address or token symbol (e.g., PEPE, DOGE)"
                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomTokenSubmit()}
              />
              <button
                onClick={handleCustomTokenSubmit}
                disabled={!customTokenInput.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-all"
              >
                Create Market
              </button>
            </div>
            {customToken && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">
                  ✅ Market created for {customToken.name} 
                  {customToken.contractAddress && (
                    <span className="text-gray-400"> ({customToken.contractAddress.substring(0, 8)}...)</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Token Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {customToken ? 'Your Markets & Active Launches' : 'Active Token Launches'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Include custom token if it exists */}
            {customToken && (
              <div
                key={customToken.id}
                onClick={() => setSelectedToken(customToken)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedToken.id === customToken.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/20 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{customToken.name}</h3>
                    <p className="text-gray-400">${customToken.symbol}</p>
                    {customToken.contractAddress && (
                      <p className="text-xs text-blue-400 mt-1">
                        {customToken.contractAddress.substring(0, 10)}...
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Launches in</div>
                    <div className="font-mono text-lg text-green-400">
                      {formatTimeRemaining(customToken.launchTime)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Volume: ${customToken.totalVolume}</span>
                  <span className="text-blue-400 font-medium">Custom Market</span>
                </div>
              </div>
            )}
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


















