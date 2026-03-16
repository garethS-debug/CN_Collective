import MemoryCard from "./MemoryCard.jsx";

function MemoryBoard({ cards, onCardClick }) {
  return (
    <div className="mt-5 grid grid-cols-3 gap-3">
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
