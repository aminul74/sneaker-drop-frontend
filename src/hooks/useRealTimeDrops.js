import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";

const API_BASE_URL = "http://localhost:3001/api";

const transformDropData = (apiData) => {
  return apiData.map((drop) => ({
    id: drop.id,
    name: drop.name,
    price: drop.price,
    available: drop.available_stock,
    total: drop.total_stock,
    startTime: drop.start_time,
    image: drop.imageUrl || "",
    purchasers: drop.Purchases || [],
  }));
};

export const useRealTimeDrops = () => {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { on } = useSocket();

  // Initial fetch
  const fetchDrops = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/drops`);

      if (!response.ok) {
        throw new Error("Failed to fetch drops");
      }

      const data = await response.json();
      const transformed = transformDropData(data);
      setDrops(transformed);
    } catch (err) {
      console.error("Error fetching drops:", err);
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
      console.log("Stock update received:", data);
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
      console.log("Purchase completed:", data);
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
