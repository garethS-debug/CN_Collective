function Header({ user, onLoginClick, onRegisterClick, onLogout }) {
  return (
    <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/75 px-5 py-4 shadow-[0_10px_35px_rgba(93,64,55,0.12)] backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
          Mini Games
        </p>
        <h1 className="text-2xl font-black text-stone-900 sm:text-3xl">
          mini games
        </h1>
        {user ? (
          <p className="mt-1 text-sm font-medium text-stone-600">
            Signed in as {user.name}
          </p>
        ) : null}
      </div>

      {user ? (
        <div className="flex items-center gap-3">
          <div className="hidden rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 sm:block">
            {user.name}
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
