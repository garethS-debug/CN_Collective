function AuthModal({
  isOpen,
  mode,
  formData,
  errorMessage,
  isSubmitting,
  onClose,
  onModeChange,
  onChange,
  onSubmit,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-[#fffaf1] p-6 shadow-[0_20px_60px_rgba(41,26,21,0.28)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              {mode === "login" ? "Login" : "Registration"}
            </p>
            <h3 className="text-2xl font-black text-stone-900">
              {mode === "login" ? "Log in to your account" : "Create an account"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-full border border-stone-300 text-lg font-semibold text-stone-700 transition hover:border-amber-600 hover:text-amber-700"
          >
            ×
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-full bg-stone-200 p-1">
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "login" ? "bg-white text-stone-900 shadow" : "text-stone-600"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onModeChange("register")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "register" ? "bg-white text-stone-900 shadow" : "text-stone-600"
            }`}
          >
            Sign up
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {mode === "register" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Name
              </span>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={onChange}
                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-amber-600"
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-700">
              Email
            </span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={onChange}
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-amber-600"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-700">
              Password
            </span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={onChange}
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-amber-600"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "login"
                ? "Log in"
                : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
