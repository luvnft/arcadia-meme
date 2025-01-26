import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { PopupMessage } from "./popUp";
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

interface Position {
  type: "Buy" | "Sell";
  amount: number;
  entryPrice: number;
  pnl: number; // Profit and Loss
}

const fallbackCoins: CoinData[] = [
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

  const [popup, setPopup] = useState<{
    type: "error" | "warning" | "info";
    message: string;
    image?: string; // Optional image property
  } | null>(null);

  const [positions, setPositions] = useState<Position[]>([]); // Start with no positions
  const [tradeType, setTradeType] = useState<"buy" | "sell" | null>(null);
  const [tradeAmount, setTradeAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCenteredGif, setShowCenteredGif] = useState(false); // Centered GIF state

  const coinData = location.state as CoinData | null;
  const randomFallbackCoin = useMemo(
    () => fallbackCoins[Math.floor(Math.random() * fallbackCoins.length)],
    []
  );

  useEffect(() => {
    if (!coinData) {
      setPopup({
        type: "warning",
        message: "Trading data is unavailable. Showing a fallback coin.",
      });
    }
  }, [coinData]);

  const data = coinData || randomFallbackCoin;

  const triggerCenteredGif = () => {
    setShowCenteredGif(true);
    setTimeout(() => setShowCenteredGif(false), 3000); // Show GIF for 3 seconds
  };

  const handleTrade = () => {
    if (!tradeAmount || tradeAmount <= 0) {
      setPopup({
        type: "error",
        message: "Please enter a valid amount to trade.",
      });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newPosition: Position = {
        type: tradeType === "buy" ? "Buy" : "Sell",
        amount: tradeAmount,
        entryPrice: Math.random() * 1000 + 1000, // Random price for simplicity
        pnl: Math.random() * 200 - 100, // Random PnL
      };

      setPositions((prevPositions) => [...prevPositions, newPosition]); // Add the new position
      setTradeAmount(null); // Reset trade input
      setIsProcessing(false);

      setPopup({
        type: "info",
        message: `Successfully ${tradeType === "buy" ? "bought" : "sold"} ${
          tradeAmount
        } ${data.ticker}!`,
        image: "/1000x-ape.gif", // Add the GIF here
      });

      triggerCenteredGif(); // Show centered GIF on trade success
    }, 2000);
  };

  const handleExitAll = () => {
    const totalPnL = positions.reduce((acc, pos) => acc + pos.pnl, 0); // Sum up all PnL
    setPositions([]); // Clear all positions
    setPopup({
      type: totalPnL >= 0 ? "info" : "error",
      message: `Exited all positions with a ${
        totalPnL >= 0 ? "profit" : "loss"
      } of $${totalPnL.toFixed(2)}!`,
      image: totalPnL >= 0 ? "/1000x-ape.gif" : undefined, // Show GIF if profit
    });

    if (totalPnL >= 0) {
      triggerCenteredGif(); // Show centered GIF on profit
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col relative">
      {/* Centered GIF Overlay */}
      {showCenteredGif && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <img src="/1000x-ape.gif" alt="Celebration" className="w-64 h-64 animate-bounce" />
        </div>
      )}

      {/* Popup Message */}
      {popup && (
        <PopupMessage
          type={popup.type}
          message={popup.message}
          image={popup.image}
          onDismiss={() => setPopup(null)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Existing Content */}
        <div className="flex-1 p-6">
          <TradingViewWidget symbol={data.ticker.toUpperCase()} />
        </div>

        {/* Trade Form and Positions */}
        <div className="lg:w-1/3 w-full bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            {/* Trade Form */}
            <button onClick={handleExitAll} disabled={positions.length === 0}>
              Exit All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
