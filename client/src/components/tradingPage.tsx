import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import TradingViewWidget from "./tradingWidget";

interface CoinData {
  name: string;
  ticker: string;
  description: string;
  logo: string; // URL for the logo
  marketCap: number;
  bondingProgress: number;
  kingProgress: number;
  address: string; // Contract address
}

const fallbackCoins = [
  {
    name: "Ethereum",
    ticker: "ETH",
    description: "Ethereum is a decentralized blockchain platform.",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    marketCap: 200000000,
    bondingProgress: 80,
    kingProgress: 90,
    address: "0x0000...0000",
  },
  {
    name: "Solana",
    ticker: "SOL",
    description: "Solana is a blockchain optimized for speed and scalability.",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
    marketCap: 100000000,
    bondingProgress: 60,
    kingProgress: 70,
    address: "0x1111...1111",
  },
  {
    name: "Bitcoin",
    ticker: "BTC",
    description: "Bitcoin is the first decentralized cryptocurrency.",
    logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    marketCap: 1000000000,
    bondingProgress: 95,
    kingProgress: 100,
    address: "0x2222...2222",
  },
  {
    name: "TrumpCoin",
    ticker: "TRUMP",
    description: "TrumpCoin is a meme coin inspired by Trump’s popularity.",
    logo: "https://via.placeholder.com/100?text=TRUMP",
    marketCap: 50000000,
    bondingProgress: 50,
    kingProgress: 60,
    address: "0x3333...3333",
  },
];

export const TradingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve data from location or fallback to a random coin
  const coinData = location.state as CoinData | null;
  const randomFallbackCoin =
    fallbackCoins[Math.floor(Math.random() * fallbackCoins.length)];

  useEffect(() => {
    if (!coinData) {
      console.warn("Coin data is null, falling back to random coin.");
    }
  }, [coinData]);

  const data = coinData || randomFallbackCoin;

  if (!data) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-bold text-lg">
            Failed to load trading data. Redirecting to the home page...
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <a href="/" className="text-gray-400 text-sm underline">
            [go back]
          </a>
          <span className="font-bold text-lg">
            {data.name.toUpperCase()} ({data.ticker.toUpperCase()})
          </span>
        </div>
        <div className="flex space-x-4 text-gray-400 text-sm">
          <a href="#" className="hover:text-white">
            how it works
          </a>
          <a href="#" className="hover:text-white">
            advanced
          </a>
          <a href="#" className="hover:text-white">
            support
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Trading Chart Section */}
        <div className="flex-1 p-6">
          <TradingViewWidget symbol={data.ticker.toUpperCase()} />
        </div>

        {/* Trading Details Section */}
        <div className="lg:w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          {/* Trade Form */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <button className="bg-green-500 text-gray-900 px-4 py-2 rounded-lg font-bold">
                Buy
              </button>
              <button className="bg-gray-600 text-gray-400 px-4 py-2 rounded-lg font-bold">
                Sell
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  Amount ({data.ticker.toUpperCase()})
                </span>
                <input
                  type="number"
                  placeholder="0.0"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600"
                />
                <img
                  src={data.logo}
                  alt={data.name}
                  className="w-8 h-8 rounded-lg"
                />
              </div>
              <div className="flex justify-between space-x-2">
                <button className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg">
                  Reset
                </button>
                <div className="space-x-2">
                  <button className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg">
                    0.1
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg">
                    0.5
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg">
                    1
                  </button>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-green-500 text-gray-900 rounded-lg font-bold">
                Place Trade
              </button>
            </div>
          </div>

          {/* Coin Details */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <img
                src={data.logo}
                alt={data.name}
                className="w-12 h-12 rounded-lg mr-4"
              />
              <div>
                <h3 className="text-lg font-bold">{data.name.toUpperCase()}</h3>
                <p className="text-sm text-gray-400">{data.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
