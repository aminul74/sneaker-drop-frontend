import { useState, useEffect } from "react";
import { SHOE_SIZES, RESERVATION_TIMER } from "../static/constants";

const API_URL = "http://localhost:3001/api/drops";

const ReservationModal = ({ drop, onClose, onSuccess }) => {
  const [form, setForm] = useState({ userName: "", email: "", size: "" });
  const [loading, setLoading] = useState(false);
  const [reserved, setReserved] = useState(null);
  const [timer, setTimer] = useState(RESERVATION_TIMER);
  const [error, setError] = useState(null);

  const isExpired = reserved && timer === 0;
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  useEffect(() => {
    if (!reserved) return;
    const interval = setInterval(() => {
      setTimer((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [reserved]);

  useEffect(() => {
    if (isExpired) {
      const timeout = setTimeout(onClose, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isExpired, onClose]);

  const handleReserve = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dropId: drop.id,
          userName: form.userName.trim(),
          email: form.email.trim(),
          size: form.size,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Reservation failed");
      }

      const data = await response.json();
      setReserved(data);
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
      const response = await fetch(`${API_URL}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId: reserved.id }),
      });

      if (!response.ok) {
        const { error } = await response.json();

        if (response.status === 410) {
          setError("Reservation expired");
          setReserved(null);
          setTimer(RESERVATION_TIMER);
          return;
        }

        throw new Error(error || "Purchase failed");
      }

      onSuccess("Purchase successful!");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full relative shadow-2xl shadow-blue-500/10 animate-slide-up">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl disabled:opacity-50 cursor-pointer hover:scale-110 transition-all duration-200"
        >
          ×
        </button>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {!reserved ? (
          <form onSubmit={handleReserve} className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">{drop.name}</h2>

            <input
              type="text"
              required
              value={form.userName}
              onChange={handleChange("userName")}
              placeholder="Full Name"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none disabled:opacity-50 transition-all duration-200"
            />

            <input
              type="email"
              required
              value={form.email}
              onChange={handleChange("email")}
              placeholder="Email"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none disabled:opacity-50 transition-all duration-200"
            />

            <select
              required
              value={form.size}
              onChange={handleChange("size")}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none disabled:opacity-50 transition-all duration-200 cursor-pointer"
            >
              <option value="">Select Size</option>
              {SHOE_SIZES.map((s) => (
                <option key={s} value={s}>
                  US {s}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 cursor-pointer transition-all duration-200 active:scale-95 disabled:cursor-not-allowed"
            >
              {loading ? "Reserving..." : "Reserve Now"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-5xl">✅</div>
            <h2 className="text-2xl font-bold text-white">Reserved!</h2>

            <div className="bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Reservation ID:</span>
                <span className="text-white font-mono text-xs">
                  {reserved.id}
                </span>
              </div>
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
              className={`rounded-lg p-4 border ${
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

            <button
              onClick={handlePurchase}
              disabled={loading || isExpired}
              className="w-full py-3 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 cursor-pointer transition-all duration-200 active:scale-95 disabled:cursor-not-allowed"
            >
              {isExpired
                ? "Expired"
                : loading
                  ? "Processing..."
                  : "Complete Purchase"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationModal;
