const fruitImageModules = import.meta.glob("../../assets/memory-cards/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
});

const fruitImageMap = Object.fromEntries(
  Object.entries(fruitImageModules).map(([path, module]) => {
    const fileName = path.split("/").pop().split(".")[0];
    return [fileName, module.default];
  })
);

export const fruitCards = [
  { key: "apple", emoji: "🍎", label: "Apple" },
  { key: "banana", emoji: "🍌", label: "Banana" },
  { key: "grape", emoji: "🍇", label: "Grape" },
  { key: "strawberry", emoji: "🍓", label: "Strawberry" },
  { key: "orange", emoji: "🍊", label: "Orange" },
  { key: "watermelon", emoji: "🍉", label: "Watermelon" },
];

export const cardBackImage =
  fruitImageMap["back-card"] ?? fruitImageMap["card-back"] ?? null;

export function getFruitImage(key) {
  return fruitImageMap[key] ?? null;
}

export function createShuffledCards() {
  return [...fruitCards, ...fruitCards]
    .map((fruit, index) => ({
      id: `${fruit.key}-${index}-${Math.random().toString(36).slice(2, 8)}`,
      key: fruit.key,
      emoji: fruit.emoji,
      label: fruit.label,
      image: getFruitImage(fruit.key),
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5);
}

export function calculateScore(moves) {
  return Math.max(1, 100 - moves * 4);
}
