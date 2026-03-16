function UserSidebar({ user, myResults, leaderboard, isLoadingSidebar }) {
  return (
    <aside className="h-fit rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_16px_40px_rgba(93,64,55,0.12)]">
      <div className="mb-6 rounded-[1.5rem] bg-amber-50 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
          Player
        </p>
        <h3 className="mt-2 text-2xl font-black text-stone-900">
          {user.name}
        </h3>
        <p className="mt-1 text-sm text-stone-600">{user.email}</p>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-lg font-black text-stone-900">My Results</h4>
          {isLoadingSidebar ? (
            <span className="text-xs font-semibold text-stone-500">
              Loading...
            </span>
          ) : null}
        </div>

        <div className="space-y-3">
          {myResults.length > 0 ? (
            myResults.slice(0, 5).map((result) => (
              <div key={result.id} className="rounded-2xl bg-stone-100 px-4 py-3">
                <p className="text-sm font-black text-stone-900">
                  {result.game?.title || "Game"}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  Score: {result.score} | Time: {result.duration}s
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-600">
              No saved results yet.
            </p>
          )}
        </div>
      </section>

      <section className="mt-6">
        <h4 className="mb-3 text-lg font-black text-stone-900">
          Memory Cards Ranking
        </h4>

        <div className="space-y-3">
          {leaderboard.length > 0 ? (
            leaderboard.slice(0, 5).map((result, index) => (
              <div
                key={result.id}
                className="flex items-center justify-between rounded-2xl bg-stone-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-black text-stone-900">
                    #{index + 1} {result.user?.name || "Player"}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    Score: {result.score}
                  </p>
                </div>
                <span className="text-sm font-semibold text-stone-600">
                  {result.duration}s
                </span>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-600">
              No ranking data yet.
            </p>
          )}
        </div>
      </section>
    </aside>
  );
}

export default UserSidebar;
