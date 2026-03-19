import { useEffect, useMemo, useState } from "react";
import useSaveGameResult from "../hooks/useSaveGameResult.js";

const GRID_SIZE = 4;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
const EMPTY_TILE = TOTAL_TILES;

function isSolved(tiles) {
  return tiles.every((tile, index) => tile === index + 1);
}

function isNeighbor(firstIndex, secondIndex) {
  const firstRow = Math.floor(firstIndex / GRID_SIZE);
  const firstColumn = firstIndex % GRID_SIZE;
  const secondRow = Math.floor(secondIndex / GRID_SIZE);
  const secondColumn = secondIndex % GRID_SIZE;

  return Math.abs(firstRow - secondRow) + Math.abs(firstColumn - secondColumn) === 1;
}

function getNeighborIndexes(emptyIndex) {
  const row = Math.floor(emptyIndex / GRID_SIZE);
  const column = emptyIndex % GRID_SIZE;
  const neighbors = [];

  if (row > 0) neighbors.push(emptyIndex - GRID_SIZE);
  if (row < GRID_SIZE - 1) neighbors.push(emptyIndex + GRID_SIZE);
  if (column > 0) neighbors.push(emptyIndex - 1);
  if (column < GRID_SIZE - 1) neighbors.push(emptyIndex + 1);

  return neighbors;
}

function createInitialTiles() {
  const tiles = Array.from({ length: TOTAL_TILES }, (_, index) => index + 1);
  let emptyIndex = TOTAL_TILES - 1;
  let previousIndex = -1;

  for (let move = 0; move < 80; move += 1) {
    const options = getNeighborIndexes(emptyIndex).filter(
      (index) => index !== previousIndex,
    );
    const nextIndex = options[Math.floor(Math.random() * options.length)];

    [tiles[emptyIndex], tiles[nextIndex]] = [tiles[nextIndex], tiles[emptyIndex]];
    previousIndex = emptyIndex;
    emptyIndex = nextIndex;
  }

  return tiles;
}

function GameFiveCard({ onResultSaved }) {
  const { saveGameResult } = useSaveGameResult();
  const [tiles, setTiles] = useState(createInitialTiles);
  const [moves, setMoves] = useState(0);
  const [statusMessage, setStatusMessage] = useState(
    "Slide the tiles until the numbers are in order.",
  );
  const [hasSavedResult, setHasSavedResult] = useState(false);
  const [sessionStart] = useState(() => Date.now());

  const solved = useMemo(() => isSolved(tiles), [tiles]);

  useEffect(() => {
    if (!solved || hasSavedResult) {
      return;
    }

    const duration = Math.max(1, Math.round((Date.now() - sessionStart) / 1000));
    const score = Math.max(10, 220 - moves * 4);

    const persist = async () => {
      try {
        const result = await saveGameResult({
          gameKey: "fifteen_puzzle",
          score,
          duration,
        });

        if (result.requiresAuth) {
          setStatusMessage("Puzzle solved. Log in to save your score.");
          setHasSavedResult(true);
          return;
        }

        setStatusMessage("Puzzle solved. Score saved.");
        onResultSaved?.();
      } catch (error) {
        setStatusMessage("Puzzle solved. Could not save score.");
      } finally {
        setHasSavedResult(true);
      }
    };

    persist();
  }, [hasSavedResult, moves, onResultSaved, saveGameResult, sessionStart, solved]);

  const handleTileClick = (index) => {
    if (solved) {
      return;
    }

    const emptyIndex = tiles.indexOf(EMPTY_TILE);

    if (!isNeighbor(index, emptyIndex)) {
      setStatusMessage("Only tiles next to the empty space can move.");
      return;
    }

    setTiles((current) => {
      const next = [...current];
      [next[index], next[emptyIndex]] = [next[emptyIndex], next[index]];
      return next;
    });
    setMoves((current) => current + 1);
    setStatusMessage("Keep going.");
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-[0_16px_40px_rgba(93,64,55,0.12)] sm:p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-stone-800">
          Moves: {moves}
        </div>
        <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-stone-800">
          Goal: 1 to 15
        </div>
        <div className="rounded-2xl bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-800">
          {statusMessage}
        </div>
      </div>

      <div className="mt-4 flex flex-1 items-center justify-center rounded-[1.75rem] bg-[linear-gradient(180deg,#fff7ed_0%,#fde68a_100%)] p-4 sm:p-6">
        <div className="grid aspect-square w-full max-w-[30rem] grid-cols-4 gap-2 rounded-[1.5rem] bg-white/60 p-2 shadow-[0_12px_25px_rgba(93,64,55,0.12)]">
          {tiles.map((tile, index) =>
            tile === EMPTY_TILE ? (
              <div
                key={`empty-${index}`}
                className="rounded-[1rem] bg-white/30"
              />
            ) : (
              <button
                key={tile}
                type="button"
                onClick={() => handleTileClick(index)}
                className="rounded-[1rem] border border-white/80 bg-white px-2 py-4 text-2xl font-black text-stone-900 shadow-[0_8px_16px_rgba(93,64,55,0.12)] transition hover:-translate-y-0.5 sm:text-3xl"
              >
                {tile}
              </button>
            ),
          )}
        </div>
      </div>
    </article>
  );
}

export default GameFiveCard;
