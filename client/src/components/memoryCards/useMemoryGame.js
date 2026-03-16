import { useEffect, useMemo, useState } from "react";
import { createShuffledCards, fruitEmojis } from "./memoryUtils.js";

function useMemoryGame() {
  const [cards, setCards] = useState(() => createShuffledCards());
  const [selectedCards, setSelectedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Flip two cards to find a match."
  );
  const [startTime, setStartTime] = useState(() => Date.now());

  const matchedPairs = useMemo(
    () => cards.filter((card) => card.isMatched).length / 2,
    [cards]
  );

  const allMatched = matchedPairs === fruitEmojis.length;

  useEffect(() => {
    if (selectedCards.length !== 2) {
      return undefined;
    }

    setIsLocked(true);

    const [firstId, secondId] = selectedCards;
    const firstCard = cards.find((card) => card.id === firstId);
    const secondCard = cards.find((card) => card.id === secondId);

    if (!firstCard || !secondCard) {
      setSelectedCards([]);
      setIsLocked(false);
      return undefined;
    }

    if (firstCard.emoji === secondCard.emoji) {
      setCards((currentCards) =>
        currentCards.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        )
      );
      setSelectedCards([]);
      setIsLocked(false);
      setStatusMessage("Nice match!");
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCards((currentCards) =>
        currentCards.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, isFlipped: false }
            : card
        )
      );
      setSelectedCards([]);
      setIsLocked(false);
      setStatusMessage("Try again.");
    }, 850);

    return () => window.clearTimeout(timeoutId);
  }, [cards, selectedCards]);

  const handleCardClick = (cardId) => {
    if (isLocked) {
      return;
    }

    const currentCard = cards.find((card) => card.id === cardId);

    if (!currentCard || currentCard.isFlipped || currentCard.isMatched) {
      return;
    }

    const updatedSelectedCards = [...selectedCards, cardId];

    setCards((currentCards) =>
      currentCards.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );
    setSelectedCards(updatedSelectedCards);

    if (updatedSelectedCards.length === 2) {
      setMoves((currentMoves) => currentMoves + 1);
    }
  };

  const restartGame = () => {
    setCards(createShuffledCards());
    setSelectedCards([]);
    setMoves(0);
    setIsLocked(false);
    setStatusMessage("Flip two cards to find a match.");
    setStartTime(Date.now());
  };

  return {
    cards,
    moves,
    matchedPairs,
    allMatched,
    statusMessage,
    setStatusMessage,
    startTime,
    handleCardClick,
    restartGame,
    totalPairs: fruitEmojis.length,
  };
}

export default useMemoryGame;
