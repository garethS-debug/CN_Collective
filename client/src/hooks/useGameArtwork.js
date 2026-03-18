import gameOneImage from "../assets/games/game-1.png";
import gameTwoImage from "../assets/games/game-2.png";

const artworkByGameKey = {
  memory_cards: gameOneImage,
  find_the_number: gameTwoImage,
};

function useGameArtwork(gameKey) {
  return artworkByGameKey[gameKey] ?? null;
}

export default useGameArtwork;
