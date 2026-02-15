import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";
import config from "../utils/config";

/**
 * Transform API response data into frontend format
 * Maps database field names to component prop names
 */
const transformDropData = (apiData) => {
  return apiData.map((drop) => ({
    id: drop.id,
    name: drop.name,
    price: drop.price,
    available: drop.available_stock,
    total: drop.total_stock,
    startTime: drop.start_time,
    image: drop.image_url || "",
    purchasers: drop.Purchases || [],
  }));
};

/**
 * Hook: useRealTimeDrops
 * Fetches drops data and subscribes to real-time updates via WebSocket
 * Handles stock updates and purchase completions
 */
export const useRealTimeDrops = () => {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { on } = useSocket();

  // Initial fetch
  const fetchDrops = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiUrl}/drops`);

      if (!response.ok) {
        throw new Error("Failed to fetch drops");
      }

      const data = await response.json();
      const transformed = transformDropData(data);
      setDrops(transformed);
    } catch (err) {
      setError("Failed to load drops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDrops();

    // Subscribe to real-time stock updates
    const unsubscribeStock = on("stock_update", (data) => {
      setDrops((prevDrops) =>
        prevDrops.map((drop) =>
          drop.id === data.dropId
            ? { ...drop, available: data.available_stock }
            : drop,
        ),
      );
    });

    // Subscribe to purchase updates
    const unsubscribePurchase = on("purchase_complete", (data) => {
      // Refresh drops to get updated purchaser list
      fetchDrops();
    });

    return () => {
      if (typeof unsubscribeStock === "function") unsubscribeStock();
      if (typeof unsubscribePurchase === "function") unsubscribePurchase();
    };
  }, [on]);

  return { drops, loading, error, refetch: fetchDrops };
};
