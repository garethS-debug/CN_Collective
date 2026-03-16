function MemoryCard({ card, onClick }) {
  const isVisible = card.isFlipped || card.isMatched;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex aspect-square items-center justify-center rounded-2xl border text-3xl transition ${
        isVisible
          ? "border-amber-300 bg-amber-100"
          : "border-stone-300 bg-stone-900 text-white hover:bg-stone-800"
      } ${card.isMatched ? "ring-2 ring-emerald-400" : ""}`}
    >
      {isVisible ? card.emoji : "?"}
    </button>
  );
}

export default MemoryCard;
