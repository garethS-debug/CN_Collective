import { useEffect, useMemo, useState } from "react";
import useSaveGameResult from "../hooks/useSaveGameResult.js";

const TOTAL_NUMBERS = 30;
const FIELD_POSITIONS = [
  { x: 8, y: 12 },
  { x: 22, y: 9 },
  { x: 37, y: 14 },
  { x: 53, y: 8 },
  { x: 68, y: 13 },
  { x: 84, y: 10 },
  { x: 13, y: 28 },
  { x: 28, y: 24 },
  { x: 43, y: 31 },
  { x: 59, y: 26 },
  { x: 74, y: 30 },
  { x: 89, y: 24 },
  { x: 9, y: 45 },
  { x: 24, y: 40 },
  { x: 39, y: 47 },
  { x: 54, y: 42 },
  { x: 69, y: 46 },
  { x: 84, y: 40 },
  { x: 14, y: 61 },
  { x: 29, y: 57 },
  { x: 44, y: 64 },
  { x: 60, y: 58 },
  { x: 75, y: 63 },
  { x: 89, y: 57 },
  { x: 8, y: 78 },
  { x: 23, y: 74 },
  { x: 39, y: 80 },
  { x: 56, y: 75 },
  { x: 72, y: 80 },
  { x: 87, y: 75 },
];

function shuffle(items) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function createNumberTiles() {
  const numbers = shuffle(
    Array.from({ length: TOTAL_NUMBERS }, (_, index) => index + 1),
  );
  const positions = shuffle(FIELD_POSITIONS);

  return numbers.map((value, index) => ({
    value,
    position: positions[index],
  }));
}

function GameFourCard({ onResultSaved }) {
  const { saveGameResult } = useSaveGameResult();
  const [numberTiles] = useState(createNumberTiles);
  const [nextNumber, setNextNumber] = useState(1);
  const [mistakes, setMistakes] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Tap number 1 to begin.");
  const [hasSavedResult, setHasSavedResult] = useState(false);
  const [sessionStart] = useState(() => Date.now());

  const completedCount = nextNumber - 1;
  const isFinished = nextNumber > TOTAL_NUMBERS;

  const score = useMemo(() => {
    if (!isFinished) {
      return 0;
    }

    return Math.max(10, TOTAL_NUMBERS * 4 - mistakes * 2);
  }, [isFinished, mistakes]);

  useEffect(() => {
    if (!isFinished || hasSavedResult) {
      return;
    }

    const duration = Math.max(1, Math.round((Date.now() - sessionStart) / 1000));

    const persist = async () => {
      try {
        const result = await saveGameResult({
          gameKey: "number_hunt",
          score,
          duration,
        });

        if (result.requiresAuth) {
          setStatusMessage(
            "Great job. You found all numbers. Log in to save your score.",
          );
          setHasSavedResult(true);
          return;
        }

        setStatusMessage("Great job. You found all numbers. Score saved.");
        onResultSaved?.();
      } catch (error) {
        setStatusMessage(
          "Great job. You found all numbers. Could not save score.",
        );
      } finally {
        setHasSavedResult(true);
      }
    };

    persist();
  }, [hasSavedResult, isFinished, onResultSaved, saveGameResult, score, sessionStart]);

  const handleNumberClick = (value) => {
    if (isFinished) {
      return;
    }

    if (value !== nextNumber) {
      setMistakes((current) => current + 1);
      setStatusMessage(`That was ${value}. Please find ${nextNumber}.`);
      return;
    }

    const followingNumber = value + 1;
    setNextNumber(followingNumber);

    if (value === TOTAL_NUMBERS) {
      setStatusMessage("All numbers found.");
      return;
    }

    setStatusMessage(`Good. Now find ${followingNumber}.`);
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-[0_16px_40px_rgba(93,64,55,0.12)] sm:p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-semibold text-stone-800">
          Next: {isFinished ? "Done" : nextNumber}
        </div>
        <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-stone-800">
          Found: {completedCount}/{TOTAL_NUMBERS}
        </div>
        <div className="rounded-2xl bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-800">
          Mistakes: {mistakes}
        </div>
      </div>

      <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-stone-800">
        {statusMessage}
      </p>

      <div className="relative mt-4 min-h-[28rem] flex-1 overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_rgba(224,242,254,0.9)_55%,_rgba(186,230,253,1)_100%)] sm:min-h-[34rem]">
        {numberTiles.map(({ value, position }) => {
          const isDone = value < nextNumber;

          return (
            <button
              key={value}
              type="button"
              onClick={() => handleNumberClick(value)}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 text-lg font-black shadow-[0_10px_20px_rgba(93,64,55,0.12)] transition sm:h-14 sm:w-14 sm:text-xl ${isDone ? "bg-emerald-200 text-emerald-900" : "bg-white text-stone-900 hover:scale-105 hover:bg-sky-50"}`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </article>
  );
}

export default GameFourCard;
