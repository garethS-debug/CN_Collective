import PaddleGame from './paddleGame/PaddleGame'


export default function Game02Frame({ onResultSaved }) {
  return (
    <PaddleGame onResultSaved={onResultSaved} />
  );
}
