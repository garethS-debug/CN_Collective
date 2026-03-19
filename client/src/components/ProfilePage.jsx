function ProfilePage({
  user,
  avatar,
  avatars,
  selectedAvatarId,
  onSelectAvatar,
  myResults,
  leaderboard,
}) {
  const totalXp = myResults.reduce((sum, result) => sum + result.score, 0);
  const xpProgress = Math.min(100, Math.round((totalXp / 200) * 100));

  return (
    <section className="page-shell rounded-[2.25rem] border border-white/70 bg-white/75 p-6 shadow-[0_20px_60px_rgba(39,30,22,0.14)] backdrop-blur">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="mb-8 flex items-center gap-4">
            <div className="profile-glow flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.5rem] bg-amber-100">
              {avatar ? (
                <img
                  src={avatar.src}
                  alt="Selected avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl">🧓</span>
              )}
            </div>
            <div className="flex-1">
              <div className="h-5 overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-orange-300 transition-all duration-700"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-stone-700">
                {totalXp} XP
              </p>
            </div>
          </div>

          <h2 className="text-6xl font-black tracking-tight text-stone-900">
            {user.name}
          </h2>
          <p className="mt-5 max-w-xl text-2xl text-stone-700">
            Player profile with saved scores, progress and room for future game
            achievements.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {myResults.length > 0 ? (
              myResults.slice(0, 4).map((result) => (
                <div
                  key={result.id}
                  className="rounded-[1.75rem] bg-white px-4 py-5 shadow-[0_14px_30px_rgba(39,30,22,0.08)]"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                    {result.game?.title || "Game"}
                  </p>
                  <p className="mt-3 text-xl font-black text-stone-900">
                    {result.score}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    {result.duration}s
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-[1.75rem] bg-white px-4 py-5 text-sm font-semibold text-stone-600 shadow-[0_14px_30px_rgba(39,30,22,0.08)]">
                No results yet. Play a game to start building your profile.
              </p>
            )}
          </div>

          <div className="mt-10">
            <h3 className="text-2xl font-black text-stone-900">
              Choose your avatar
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {avatars.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectAvatar(item.id)}
                  className={`rounded-[1.5rem] border bg-white p-3 shadow-[0_14px_30px_rgba(39,30,22,0.08)] transition hover:-translate-y-1 ${
                    selectedAvatarId === item.id
                      ? "border-amber-500 ring-2 ring-amber-200"
                      : "border-white"
                  }`}
                >
                  <img
                    src={item.src}
                    alt={`Avatar ${item.id}`}
                    className="mx-auto h-24 w-24 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] bg-white p-6 shadow-[0_16px_40px_rgba(39,30,22,0.12)]">
          <div className="mb-6 flex items-center justify-center rounded-[1.75rem] bg-stone-100 p-6">
            {avatar ? (
              <img
                src={avatar.src}
                alt="Selected avatar"
                className="h-64 w-64 object-contain"
              />
            ) : (
              <div className="text-[10rem]">🧑</div>
            )}
          </div>
          <h3 className="text-2xl font-black text-stone-900">Top Ranking</h3>
          <div className="mt-5 space-y-3">
            {leaderboard.length > 0 ? (
              leaderboard.slice(0, 5).map((result, index) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between rounded-[1.25rem] bg-stone-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-black text-stone-900">
                      #{index + 1} {result.user?.name || "Player"}
                    </p>
                    <p className="text-xs text-stone-500">
                      {result.game?.title || "Game"} | Score {result.score}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-stone-600">
                    {result.duration}s
                  </span>
                </div>
              ))
            ) : (
              <p className="rounded-[1.25rem] bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-600">
                No ranking data yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ProfilePage;
