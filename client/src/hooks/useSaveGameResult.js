const API_RESULTS_URL =
  (typeof window !== "undefined" && window.__API && window.__API.RESULTS) ||
  import.meta.env.VITE_RESULTS_API_URL ||
  "http://127.0.0.1:5001/api/results";
const TOKEN_STORAGE_KEY = "mini-games-token";

function useSaveGameResult() {
  const saveGameResult = async ({ gameKey, score, duration }) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      return {
        success: false,
        requiresAuth: true,
      };
    }

    const response = await fetch(API_RESULTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        gameKey,
        score,
        duration,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save result");
    }

    return {
      success: true,
    };
  };

  return {
    saveGameResult,
  };
}

export default useSaveGameResult;
