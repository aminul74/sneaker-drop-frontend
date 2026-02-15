import { useState, useEffect } from "react";
import { SHOE_SIZES, RESERVATION_TIMER } from "../static/constants";
import { dropService } from "../services/dropService";

/**
 * DropCard Component
 * Displays a single sneaker drop with reservation and purchase flow
 * Supports three modes: card (display), form (reservation), reserved (checkout)
 */
const DropCard = ({ drop, onSuccess }) => {
  // ========== STATE ==========
  const [countdown, setCountdown] = useState("");
  const [mode, setMode] = useState("card");
  const [form, setForm] = useState({ userName: "", email: "", size: "" });
  const [loading, setLoading] = useState(false);
  const [reserved, setReserved] = useState(() => {
    try {
      const saved = localStorage.getItem(`reserved_${drop.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMode("reserved");
        return parsed;
      }
    } catch (err) {
      // Silently handle localStorage errors
    }
    return null;
  });
  const [timer, setTimer] = useState(() => {
    try {
      const savedTimer = localStorage.getItem(`timer_${drop.id}`);
      return savedTimer ? parseInt(savedTimer) : RESERVATION_TIMER;
    } catch {
      return RESERVATION_TIMER;
    }
  });
  const [error, setError] = useState(null);

  const isExpired = reserved && timer === 0;
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  // ========== EFFECTS ==========
  // Persist reservation to localStorage
  useEffect(() => {
    if (reserved) {
      localStorage.setItem(`reserved_${drop.id}`, JSON.stringify(reserved));
      localStorage.setItem(`timer_${drop.id}`, timer.toString());
    } else {
      localStorage.removeItem(`reserved_${drop.id}`);
      localStorage.removeItem(`timer_${drop.id}`);
    }
    // Update countdown timer until drop time
  }, [reserved, timer, drop.id]);

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
  // Handle reservation timer countdown

  useEffect(() => {
    if (!reserved) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) {
          setTimeout(() => {
            setMode("card");
            setReserved(null);
            setTimer(RESERVATION_TIMER);
            setForm({ userName: "", email: "", size: "" });
            setError(null);
          }, 2000);
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [reserved]);
  // ========== HANDLERS ==========

  const isAvailable = drop.available > 0;

  const handleReserve = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await dropService.reserve(drop.id, form);
      setReserved(data);
      setMode("reserved");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (isExpired) return;

    setLoading(true);
    setError(null);

    try {
      const purchaseId = reserved.id || reserved.reservationId;
      if (!purchaseId) {
        throw new Error("No reservation found");
      }

      await dropService.purchase(purchaseId);

      // Wait a moment for socket updates
      await new Promise((resolve) => setTimeout(resolve, 500));

      onSuccess("Purchase successful!");
      setMode("card");
      setReserved(null);
      setTimer(RESERVATION_TIMER);
      setForm({ userName: "", email: "", size: "" });
      localStorage.removeItem(`reserved_${drop.id}`);
      localStorage.removeItem(`timer_${drop.id}`);
    } catch (err) {
      if (err.message === "Reservation expired") {
        setReserved(null);
        setTimer(RESERVATION_TIMER);
        setMode("card");
        localStorage.removeItem(`reserved_${drop.id}`);
        localStorage.removeItem(`timer_${drop.id}`);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========== VIEWS ==========
  // Show normal card
  if (mode === "card") {
    return (
      <div className="bg-gray-800 rounded-xl p-6 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1">
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

        <h3 className="text-xl font-bold text-white mb-3 h-14 line-clamp-2 leading-7">
          {drop.name}
        </h3>

        <div className="flex justify-between items-center mb-4 h-8">
          <span className="text-2xl font-bold text-blue-400">
            ${drop.price}
          </span>
          <span className="text-sm text-gray-400 font-medium">
            {drop.available}/{drop.total} left
          </span>
        </div>

        {/* Recent Purchasers - Activity Feed */}
        {drop.purchasers && drop.purchasers.length > 0 && (
          <div className="mb-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <p className="text-gray-400 text-xs mb-2 font-semibold">
              Recent Buyers:
            </p>
            <div className="space-y-1">
              {drop.purchasers.slice(0, 3).map((purchaser, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-white"
                >
                  <span className="mr-2">👤</span>
                  <span>{purchaser.user_name || purchaser.userName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grow"></div>

        <button
          onClick={() => setMode("form")}
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
  }

  // Show reservation form
  if (mode === "form") {
    return (
      <div className="bg-gray-800 rounded-xl p-6 flex flex-col h-full">
        <button
          onClick={() => {
            setMode("card");
            setError(null);
          }}
          className="self-end text-gray-400 hover:text-white text-2xl mb-2 cursor-pointer"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-white mb-4">{drop.name}</h2>

        {error && (
          <div className="mb-3 p-2 bg-red-900/50 border border-red-600 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleReserve}
          className="space-y-3 flex flex-col flex-1"
        >
          <input
            type="text"
            required
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
            placeholder="Full Name"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-50"
          />

          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-50"
          />

          <select
            required
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-50"
          >
            <option value="">Select Size</option>
            {SHOE_SIZES.map((s) => (
              <option key={s} value={s}>
                US {s}
              </option>
            ))}
          </select>

          <div className="grow"></div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Reserving..." : "Reserve Now"}
          </button>
        </form>
      </div>
    );
  }

  // Show reservation confirmation
  return (
    <div className="bg-gray-800 rounded-xl p-6 flex flex-col h-full">
      <div className="text-center flex-1 flex flex-col">
        <div className="text-5xl mb-3">✅</div>
        <h2 className="text-xl font-bold text-white mb-4">Reserved!</h2>

        {error && (
          <div className="mb-3 p-2 bg-red-900/50 border border-red-600 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="bg-gray-700 rounded-lg p-4 space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Size:</span>
            <span className="text-white">US {form.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Price:</span>
            <span className="text-blue-400 font-bold">${drop.price}</span>
          </div>
        </div>

        <div
          className={`rounded-lg p-4 border mb-4 ${
            isExpired
              ? "bg-red-900/50 border-red-600"
              : "bg-yellow-900/50 border-yellow-600"
          }`}
        >
          <p
            className={`font-bold text-lg ${
              isExpired ? "text-red-400" : "text-yellow-400"
            }`}
          >
            {isExpired
              ? "Expired"
              : `${minutes}:${seconds.toString().padStart(2, "0")}`}
          </p>
          <p
            className={`text-xs ${
              isExpired ? "text-red-200" : "text-yellow-200"
            }`}
          >
            {isExpired ? "Closing..." : "Complete within 60 seconds"}
          </p>
        </div>

        <div className="grow"></div>

        <button
          onClick={handlePurchase}
          disabled={loading || isExpired}
          className="w-full py-3 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50"
        >
          {isExpired
            ? "Expired"
            : loading
              ? "Processing..."
              : "Complete Purchase"}
        </button>
      </div>
    </div>
  );
};

export default DropCard;
