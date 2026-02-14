import { useState, useEffect } from "react";

const DropCard = ({ drop, onReserve }) => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const diff = new Date(drop.startTime) - new Date();

      if (diff <= 0) {
        setCountdown("LIVE NOW!");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / 1000 / 60) % 60);

      setCountdown(hours > 0 ? `${hours}h ${mins}m` : `${mins}m`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [drop.startTime]);

  const isAvailable = drop.available > 0;

  return (
    <div className="bg-gray-800 rounded-xl p-6 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1">
      {/* Image Section - Fixed Height */}
      <div className="relative h-48 bg-gray-700 rounded-lg mb-4 overflow-hidden">
        {drop.image ? (
          <img
            src={drop.image}
            alt={drop.name}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">
            👟
          </div>
        )}
        <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
          {countdown}
        </span>
      </div>

      {/* Title Section - Fixed Height */}
      <h3 className="text-xl font-bold text-white mb-3 h-14 line-clamp-2 leading-7">
        {drop.name}
      </h3>

      {/* Price Section - Fixed Height */}
      <div className="flex justify-between items-center mb-4 h-8">
        <span className="text-2xl font-bold text-blue-400">${drop.price}</span>
        <span className="text-sm text-gray-400 font-medium">
          {drop.available}/{drop.total} left
        </span>
      </div>

      {/* Spacer to push button to bottom */}
      <div className="grow"></div>

      {/* Button Section - Always at bottom */}
      <button
        onClick={() => onReserve(drop)}
        disabled={!isAvailable}
        className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${
          isAvailable
            ? "bg-blue-500 text-white hover:bg-blue-600 active:scale-95 cursor-pointer"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isAvailable ? "RESERVE NOW" : "SOLD OUT"}
      </button>
    </div>
  );
};

export default DropCard;
