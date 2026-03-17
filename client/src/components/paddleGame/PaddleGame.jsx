import { useEffect } from "react";
import useSaveGameResult from "../../hooks/useSaveGameResult.js";

export default function PaddleGame({ onResultSaved }) {
  const { saveGameResult } = useSaveGameResult();

  useEffect(() => {
    async function handleMessage(e) {
      const msg = e.data;
      if (!msg) return;
      console.log("Parent received message:", msg);

      if (msg.type !== "GAME_RESULT") return;

      const { gameKey, score, duration } = msg;
      if (gameKey == null || score == null || duration == null) {
        console.warn("Incomplete game result payload", msg);
        return;
      }

      try {
        const result = await saveGameResult({ gameKey, score, duration });
        console.log("Save result response:", result);
        if (result.requiresAuth) {
          console.warn("Save requires auth");
          return;
        }
        onResultSaved?.();
      } catch (err) {
        console.error("Failed to save game result:", err);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [saveGameResult, onResultSaved]);

  return (
    <div style={{ width: "100%" }}>
      <iframe
        src="/Game_02/index.html"
        title="Game 02"
        style={{ width: "100%", height: 520, border: "none" }}
      />
    </div>
  );
}