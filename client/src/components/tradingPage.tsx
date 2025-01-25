import TradingViewWidget from "./tradingWidget";

export const TradingPage: React.FC = () => {
  const hardcodedTickers = ["SOLUSD", "ETHUSD", "DOGEUSD", "ADAUSD"];
  const selectedTicker =
    hardcodedTickers[Math.floor(Math.random() * hardcodedTickers.length)];

  return (
    <div className="relative text-center py-20 px-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{selectedTicker} - Trading</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <TradingViewWidget symbol={selectedTicker} />
      </div>
    </div>
  );
};
