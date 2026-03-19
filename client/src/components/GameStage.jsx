import GameOneCard from "./GameOneCard.jsx";
import GameTwoCard from "./GameTwoCard.jsx";
import GameThreeCard from "./GameThreeCard.jsx";
import { useState } from "react";

function GameStage({ game, onBack, onResultSaved }) {
  const [restartSeed, setRestartSeed] = useState(0);

  return (
    <section className="page-shell flex min-h-[calc(100vh-8.5rem)] flex-col overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/75 p-4 shadow-[0_20px_60px_rgba(39,30,22,0.14)] backdrop-blur sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            Game View
          </p>
          <h2 className="mt-1 text-2xl font-black text-stone-900 sm:text-3xl">
            {game.title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
            {game.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-amber-500 hover:text-amber-700"
          >
            Back to games
          </button>
          {game.key === "memory_cards" ? (
            <button
              type="button"
              onClick={() => setRestartSeed((current) => current + 1)}
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-amber-500 hover:text-amber-700"
            >
              Restart
            </button>
          ) : null}
        </div>
      </div>

      {game.key === "memory_cards" ? (
        <div className="flex-1 overflow-hidden">
          <GameOneCard key={restartSeed} onResultSaved={onResultSaved} />
        </div>
      ) : null}

      {game.key === "find_the_number" ? (
        <div className="flex-1 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-3 shadow-[0_16px_40px_rgba(93,64,55,0.12)] sm:p-4">
          <GameTwoCard onResultSaved={onResultSaved} />
        </div>
      ) : null}

      {/* {game.key !== "memory_cards" && game.key !== "find_the_number" ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-[2rem] border border-dashed border-stone-300 bg-stone-100 text-center">
          <div className="text-7xl">{game.icon}</div>
          <h3 className="mt-5 text-3xl font-black text-stone-900">
            {game.title}
          </h3>
          <p className="mt-3 max-w-md text-base leading-7 text-stone-600">
            This page is ready for the full game experience. The team can build
            the game directly inside this full-screen layout.
          </p>
        </div>
      ) : null} */}
      {game.key === "sequence_repeat" ? (
  <div className="flex-1 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-3 shadow-[0_16px_40px_rgba(93,64,55,0.12)] sm:p-4">
    <GameThreeCard onResultSaved={onResultSaved} />
  </div>
) : null}
    </section>
  );
}

export default GameStage;
