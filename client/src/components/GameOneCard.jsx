import { useEffect, useState } from "react";
import MemoryBoard from "./memoryCards/MemoryBoard.jsx";
import { calculateScore } from "./memoryCards/memoryUtils.js";
import useMemoryGame from "./memoryCards/useMemoryGame.js";
import useSaveGameResult from "../hooks/useSaveGameResult.js";

function GameOneCard({ onResultSaved }) {
  const [hasSavedResult, setHasSavedResult] = useState(false);
  const { saveGameResult } = useSaveGameResult();
  const {
    cards,
    moves,
    matchedPairs,
    allMatched,
    statusMessage,
    setStatusMessage,
    startTime,
    handleCardClick,
    restartGame,
    totalPairs,
  } = useMemoryGame();

  useEffect(() => {
    if (!allMatched) {
      return;
    }

    const duration = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    setStatusMessage(`You won in ${moves} moves and ${duration} seconds.`);

    if (hasSavedResult) {
      return;
    }

    const saveResult = async () => {
      try {
        const result = await saveGameResult({
          gameKey: "memory_cards",
          score: calculateScore(moves),
          duration,
        });

        if (result.requiresAuth) {
          setStatusMessage(
            `You won in ${moves} moves and ${duration} seconds. Log in to save your score.`
          );
          setHasSavedResult(true);
          return;
        }

        setStatusMessage(
          `You won in ${moves} moves and ${duration} seconds. Score saved.`
        );
        onResultSaved?.();
      } catch (error) {
        setStatusMessage(
          `You won in ${moves} moves and ${duration} seconds. Could not save score.`
        );
      } finally {
        setHasSavedResult(true);
      }
    };

    saveResult();
  }, [allMatched, moves, startTime, hasSavedResult, saveGameResult, onResultSaved, setStatusMessage]);

  const handleRestart = () => {
    restartGame();
    setHasSavedResult(false);
  };

  return (
    <article className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_16px_40px_rgba(93,64,55,0.12)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-200 text-xl font-black text-stone-900">
          01
        </div>
        <button
          type="button"
          onClick={handleRestart}
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:border-amber-600 hover:text-amber-700"
        >
          Restart
        </button>
      </div>

      <h3 className="text-2xl font-black text-stone-900">Memory Cards</h3>
      <p className="mt-3 text-base leading-7 text-stone-700">
        Match the fruit pairs by flipping two cards at a time.
      </p>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-stone-700">
        <span>Moves: {moves}</span>
        <span>Pairs: {matchedPairs}/{totalPairs}</span>
      </div>

      <p className="mt-4 min-h-12 rounded-2xl bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-700">
        {statusMessage}
      </p>
      <MemoryBoard cards={cards} onCardClick={handleCardClick} />
    </article>
  );
}

export default GameOneCard;
