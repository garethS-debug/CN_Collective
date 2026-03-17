import { useEffect } from "react";
import useSaveGameResult from "../../hooks/useSaveGameResult.js";

export default function PaddleGame({ onResultSaved }) {
  const { saveGameResult } = useSaveGameResult();

  useEffect(() => {
    async function handleMessage(e) {
      const msg = e.data;
      if (!msg || msg.type !== "GAME_RESULT") return;
      const { gameKey, score, duration } = msg;

      try {
        const result = await saveGameResult({ gameKey, score, duration });
        if (result.requiresAuth) {
          // optionally open login UI or notify user
          return;
        }
        onResultSaved?.();
      } catch (err) {
        // handle/save error if wanted
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