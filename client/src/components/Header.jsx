function Header({
  user,
  avatar,
  currentView,
  onHomeClick,
  onProfileClick,
  onLoginClick,
  onRegisterClick,
  onLogout,
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_10px_35px_rgba(93,64,55,0.12)] backdrop-blur">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onHomeClick}
          className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-amber-300 via-orange-200 to-rose-200 text-4xl shadow-[0_10px_24px_rgba(217,119,6,0.22)] transition hover:-translate-y-0.5 hover:scale-[1.02]"
        >
          🎈
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
            Mini Games
          </p>
          <h1 className="text-2xl font-black text-stone-900 sm:text-3xl">
            calm play club
          </h1>
        </div>
      </div>

      {user ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onProfileClick}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              currentView === "profile"
                ? "bg-amber-100 text-amber-800"
                : "bg-white text-stone-800 hover:-translate-y-0.5 hover:text-amber-700"
            }`}
          >
            {user.name}
          </button>
          <div className="hidden items-center gap-3 rounded-full bg-stone-100 px-4 py-2 sm:flex">
            {avatar ? (
              <img
                src={avatar.src}
                alt="Selected avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : null}
            <span className="text-sm font-semibold text-stone-700">
              {user.name}
            </span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-amber-500 hover:text-amber-700"
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onLoginClick}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-amber-500 hover:text-amber-700"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={onRegisterClick}
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-700"
          >
            Sign up
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
