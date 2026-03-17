import { useEffect, useRef } from "react";
import useSaveGameResult from "../hooks/useSaveGameResult";

function GameTwoCard() {
  const iframeRef = useRef(null);
  const { saveGameResult } = useSaveGameResult();

  useEffect(() => {
    function onMessage(e) {
      if (!e.data) return;
      if (e.data.type === "gameOver") {
        // e.data.score or duration etc.
        saveGameResult({ gameKey: "breakout", score: e.data.score });
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [saveGameResult]);

  return (
    <article className="...">
      <h3>Breakout (iframe)</h3>
      <iframe
        ref={iframeRef}
        src="/Game_02/index.html"
        title="Breakout"
        style={{ width: "100%", height: 360, border: "none" }}
        sandbox="allow-scripts allow-same-origin"
      />
    </article>
  );
}

export default GameTwoCard;