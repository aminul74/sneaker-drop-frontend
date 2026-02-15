/**
 * Drop Service
 * Handles all API calls related to drops (reserve, purchase)
 * Separates business logic from UI components
 */

import config from "../utils/config";

const API_URL = `${config.apiUrl}/drops`;

export const dropService = {
  /**
   * Reserve a drop with user information
   * @param {number} dropId - Drop ID to reserve
   * @param {object} userData - User data (userName, email, size)
   */
  async reserve(dropId, userData) {
    const response = await fetch(`${API_URL}/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dropId,
        userName: userData.userName.trim(),
        email: userData.email.trim(),
        size: userData.size,
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || "Reservation failed");
    }

    return response.json();
  },

  /**
   * Complete purchase for a reservation
   * @param {number} reservationId - Reservation ID to purchase
   */
  async purchase(reservationId) {
    const response = await fetch(`${API_URL}/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservationId }),
    });

    if (!response.ok) {
      const { error } = await response.json();

      if (response.status === 410) {
        throw new Error("Reservation expired");
      }

      throw new Error(error || "Purchase failed");
    }

    return response.json();
  },
};
