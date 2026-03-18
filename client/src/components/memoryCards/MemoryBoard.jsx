import MemoryCard from "./MemoryCard.jsx";

function MemoryBoard({ cards, onCardClick }) {
  return (
    <div className="grid h-full grid-cols-3 grid-rows-4 gap-2 md:grid-cols-4 md:grid-rows-3">
      {cards.map((card) => (
        <MemoryCard
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
}

export default MemoryBoard;
