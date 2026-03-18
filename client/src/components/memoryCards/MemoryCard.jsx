import { cardBackImage } from "./memoryUtils.js";

function MemoryCard({ card, onClick }) {
  const isVisible = card.isFlipped || card.isMatched;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`memory-card-scene relative aspect-square min-h-0 w-full ${
        card.isMatched ? "ring-2 ring-emerald-400" : ""
      }`}
    >
      <div
        className={`memory-card-inner ${isVisible ? "memory-card-flipped" : ""}`}
      >
        <div className="memory-card-face memory-card-back">
          <div className="memory-card-frame">
            {cardBackImage ? (
              <img
                src={cardBackImage}
                alt="Card back"
                className="h-full w-full scale-150 object-cover object-center"
              />
            ) : (
              <span className="text-3xl text-white">?</span>
            )}
          </div>
        </div>

        <div className="memory-card-face memory-card-front">
          <div className="memory-card-frame memory-card-front-frame">
            {card.image ? (
              <img
                src={card.image}
                alt={card.label}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <span className="text-3xl">{card.emoji}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export default MemoryCard;
