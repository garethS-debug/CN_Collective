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

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-3 shadow-[0_16px_40px_rgba(93,64,55,0.12)] sm:p-4">
      <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-3 py-2 text-xs font-semibold text-stone-700 sm:px-4 sm:py-3 sm:text-sm">
        <span>Moves: {moves}</span>
        <span>Pairs: {matchedPairs}/{totalPairs}</span>
      </div>

      <p className="mt-2 rounded-2xl bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-700 sm:px-4 sm:py-3 sm:text-sm">
        {statusMessage}
      </p>

      <div className="mt-2 flex-1 overflow-hidden">
        <MemoryBoard cards={cards} onCardClick={handleCardClick} />
      </div>
    </article>
  );
}

export default GameOneCard;
