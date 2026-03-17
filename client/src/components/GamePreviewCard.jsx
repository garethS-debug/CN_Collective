import useGameArtwork from "../hooks/useGameArtwork.js";

function GamePreviewCard({ game, onPlay }) {
  const artwork = useGameArtwork(game.key);

  return (
    <article className="floating-card group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_16px_40px_rgba(39,30,22,0.12)]">
      <div
        className={`absolute inset-x-0 top-0 h-1 ${game.accent}`}
        aria-hidden="true"
      />
      <div className="mb-5 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[1.75rem] bg-stone-100 shadow-inner">
        {artwork ? (
          <img
            src={artwork}
            alt={game.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="card-icon-bob text-[6rem]">{game.icon}</span>
        )}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-2xl font-black text-stone-900">{game.title}</h3>
          <p className="mt-1 text-sm font-medium text-stone-500">
            {game.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onPlay(game)}
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-700"
        >
          Play
        </button>
      </div>
    </article>
  );
}

export default GamePreviewCard;
