import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateCoin: React.FC = () => {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [confirmTrade, setConfirmTrade] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleCreateCoin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true); // Show confirmation popup after clicking "Create Coin"
  };

  const handleTradeConfirmation = () => {
    setConfirmTrade(true);
    setShowPopup(false);
    navigate(`/trade/${ticker}`); // Navigate to the TradingView page
  };

  return (
    <section className="relative text-center py-20 px-4 bg-gray-900 text-white min-h-screen">
      <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-md">
        <a href="/" className="text-blue-500 text-sm mb-4 block underline">
          [go back]
        </a>
        <form onSubmit={handleCreateCoin} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-left text-blue-500 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Ticker */}
          <div>
            <label className="block text-left text-blue-500 mb-1">Ticker</label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-left text-blue-500 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-left text-blue-500 mb-1">
              Image or Video
            </label>
            <div className="w-full bg-gray-700 text-center py-6 rounded border border-gray-600">
              <p className="text-gray-400 mb-2">Drag and drop an image or video</p>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded cursor-pointer hover:bg-yellow-300"
              >
                Select File
              </label>
              {file && (
                <p className="text-green-500 mt-2">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-bold transition-transform transform hover:scale-105"
          >
            Create Coin
          </button>
          <p className="text-sm text-gray-500 mt-2">
            When your coin completes its bonding curve, you receive 0.5 SOL.
          </p>
        </form>
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl text-center mb-4">
              Confirm trade for [{ticker || "SRS"}]?
            </h2>
            <button
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold transition-transform transform hover:scale-105 mb-4"
              onClick={handleTradeConfirmation}
            >
              Confirm
            </button>
            <button
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-bold transition-transform transform hover:scale-105"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
