'use client';

import { useEffect, useState } from 'react';

interface LiveChartProps {
  tokenSymbol: string;
}

export default function LiveChart({ tokenSymbol }: LiveChartProps) {
  const [priceData, setPriceData] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    // Simulate live price updates
    const interval = setInterval(() => {
      const newPrice = Math.random() * 10; // Random price between 0-10
      setCurrentPrice(newPrice);
      setPriceData(prev => [...prev.slice(-29), newPrice]); // Keep last 30 data points
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const maxPrice = Math.max(...priceData, 1);
  const minPrice = Math.min(...priceData, 0);

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Live Price: {tokenSymbol}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">
            ${currentPrice.toFixed(4)}
          </div>
          <div className="text-sm text-gray-400">USD</div>
        </div>
      </div>
      
      <div className="h-32 relative">
        <svg className="w-full h-full" viewBox="0 0 300 100">
          {priceData.length > 1 && (
            <polyline
              fill="none"
              stroke="rgb(34, 197, 94)"
              strokeWidth="2"
              points={priceData
                .map((price, index) => {
                  const x = (index / (priceData.length - 1)) * 300;
                  const y = 100 - ((price - minPrice) / (maxPrice - minPrice)) * 100;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
          )}
        </svg>
        
        {priceData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Waiting for price data...
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between text-sm text-gray-400">
        <span>Low: ${minPrice.toFixed(4)}</span>
        <span>High: ${maxPrice.toFixed(4)}</span>
      </div>
    </div>
  );
}
