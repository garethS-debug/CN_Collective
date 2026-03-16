export const fruitEmojis = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉"];

export function createShuffledCards() {
  return [...fruitEmojis, ...fruitEmojis]
    .map((emoji, index) => ({
      id: `${emoji}-${index}-${Math.random().toString(36).slice(2, 8)}`,
      emoji,
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5);
}

export function calculateScore(moves) {
  return Math.max(1, 100 - moves * 4);
}
