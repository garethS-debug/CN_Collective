// function GameThreeCard() {
//   return (
//     <article className="group rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_16px_40px_rgba(93,64,55,0.12)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(93,64,55,0.18)]">
//       <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-lime-200 text-xl font-black text-stone-900">
//         03
//       </div>
//       <h3 className="text-2xl font-black text-stone-900">Game 3</h3>
//       <p className="mt-3 min-h-24 text-base leading-7 text-stone-700">
//         A calm logic game with simple rules and soft colors.
//       </p>
//       <button
//         type="button"
//         className="mt-6 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition group-hover:border-emerald-600 group-hover:text-emerald-700"
//       >
//         Coming soon
//       </button>
//     </article>
//   );
// }

// export default GameThreeCard;
import { useEffect } from "react";
import useSaveGameResult from "../hooks/useSaveGameResult.js";

export default function GameThreeCard({ onResultSaved }) {
  const { saveGameResult } = useSaveGameResult();

  useEffect(() => {
    async function handleMessage(e) {
      const msg = e.data;
      if (!msg || msg.type !== "GAME_RESULT") return;
      const { gameKey, score, duration } = msg;
      if (gameKey == null || score == null || duration == null) return;
      try {
        const result = await saveGameResult({ gameKey, score, duration });
        if (!result.requiresAuth) onResultSaved?.();
      } catch (err) {
        console.error("Save failed:", err);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [saveGameResult, onResultSaved]);

  return (
    <div className="h-full w-full flex items-start justify-center pt-36 pb-8">
      <iframe
        src="/Hangman/index.html"
        title="Hangman"
        className="w-full max-w-3xl h-[640px] rounded-[1.5rem] border-0 bg-white"
        style={{ display: "block", margin: "0 auto" }}
      />
    </div>
  );
}