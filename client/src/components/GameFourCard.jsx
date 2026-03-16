function GameFourCard() {
  return (
    <article className="group rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_16px_40px_rgba(93,64,55,0.12)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(93,64,55,0.18)]">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-300 to-pink-200 text-xl font-black text-stone-900">
        04
      </div>
      <h3 className="text-2xl font-black text-stone-900">Game 4</h3>
      <p className="mt-3 min-h-24 text-base leading-7 text-stone-700">
        A friendly mini-game with light challenges and a warm interface.
      </p>
      <button
        type="button"
        className="mt-6 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition group-hover:border-rose-600 group-hover:text-rose-700"
      >
        Coming soon
      </button>
    </article>
  );
}

export default GameFourCard;
