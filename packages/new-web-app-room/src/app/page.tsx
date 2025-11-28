'use client';

import { useState, useRef } from 'react';

// Pixel art generation utilities
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generatePixelArt = (username: string): string[][] => {
  const hash = hashString(username.toLowerCase());
  const grid: string[][] = Array(32).fill(null).map(() => Array(32).fill('#000000'));
  
  // Color palette inspired by CryptoPunks
  const colors = [
    '#FFB347', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471',
    '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2', '#A9DFBF', '#F9E79F'
  ];
  
  // Generate deterministic features based on username
  let seedCounter = hash;
  
  // Background
  const bgColor = colors[Math.floor(seededRandom(seedCounter++) * colors.length)];
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      grid[y][x] = bgColor;
    }
  }
  
  // Face shape (oval)
  const faceColor = colors[Math.floor(seededRandom(seedCounter++) * 6)];
  for (let y = 8; y < 24; y++) {
    for (let x = 10; x < 22; x++) {
      const centerX = 16, centerY = 16;
      const dx = x - centerX, dy = y - centerY;
      if ((dx * dx) / 36 + (dy * dy) / 64 < 1) {
        grid[y][x] = faceColor;
      }
    }
  }
  
  // Eyes
  const eyeColor = '#000000';
  grid[14][13] = eyeColor;
  grid[14][14] = eyeColor;
  grid[14][18] = eyeColor;
  grid[14][19] = eyeColor;
  
  // Nose
  grid[17][16] = '#8B4513';
  
  // Mouth
  grid[19][15] = eyeColor;
  grid[19][16] = eyeColor;
  grid[19][17] = eyeColor;
  
  // Hair (random pattern based on username)
  const hairColor = colors[Math.floor(seededRandom(seedCounter++) * colors.length)];
  for (let y = 4; y < 12; y++) {
    for (let x = 8; x < 24; x++) {
      if (seededRandom(seedCounter++ + x + y) > 0.6) {
        grid[y][x] = hairColor;
      }
    }
  }
  
  // Accessories (glasses, earrings, etc.)
  if (seededRandom(seedCounter++) > 0.5) {
    // Glasses
    const glassColor = '#333333';
    for (let x = 12; x < 20; x++) {
      grid[13][x] = glassColor;
      grid[15][x] = glassColor;
    }
    grid[14][11] = glassColor;
    grid[14][20] = glassColor;
  }
  
  if (seededRandom(seedCounter++) > 0.7) {
    // Earrings
    const earringColor = colors[Math.floor(seededRandom(seedCounter++) * colors.length)];
    grid[16][9] = earringColor;
    grid[16][23] = earringColor;
  }
  
  return grid;
};

export default function NFTGenerator() {
  const [username, setUsername] = useState('');
  const [pixelArt, setPixelArt] = useState<string[][] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateNFT = () => {
    if (!username.trim()) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      const art = generatePixelArt(username);
      setPixelArt(art);
      setIsGenerating(false);
      
      // Draw to canvas for download
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 320;
          canvas.height = 320;
          
          for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
              ctx.fillStyle = art[y][x];
              ctx.fillRect(x * 10, y * 10, 10, 10);
            }
          }
        }
      }
    }, 1000);
  };

  const downloadNFT = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `${username}-nft.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Discord NFT Generator
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Transform any Discord username into a unique 32×32 CryptoPunk-style NFT
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Discord username..."
                className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                onKeyPress={(e) => e.key === 'Enter' && generateNFT()}
              />
              <button
                onClick={generateNFT}
                disabled={!username.trim() || isGenerating}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? 'Generating...' : 'Generate NFT'}
              </button>
            </div>

            {pixelArt && (
              <div className="text-center">
                <div className="inline-block bg-white/20 p-4 rounded-xl mb-4">
                  <div className="grid grid-cols-32 gap-0 w-80 h-80 mx-auto">
                    {pixelArt.map((row, y) =>
                      row.map((color, x) => (
                        <div
                          key={`${x}-${y}`}
                          className="w-2.5 h-2.5"
                          style={{ backgroundColor: color }}
                        />
                      ))
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={downloadNFT}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors"
                  >
                    Download PNG
                  </button>
                  <button
                    onClick={() => setPixelArt(null)}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                  >
                    Generate New
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">How it works:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Enter any Discord username to generate a unique pixel art NFT</li>
              <li>• Each username always creates the same design (deterministic)</li>
              <li>• 32×32 pixel resolution in classic CryptoPunk style</li>
              <li>• Features include randomized hair, accessories, and colors</li>
              <li>• Download as PNG for use as profile picture or NFT</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Hidden canvas for download */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

