import { useEffect, useState } from "react";
import GameOneCard from "./components/GameOneCard.jsx";
import GameTwoCard from "./components/GameTwoCard.jsx";
import GameThreeCard from "./components/GameThreeCard.jsx";
import GameFourCard from "./components/GameFourCard.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api/auth";
const TOKEN_STORAGE_KEY = "mini-games-token";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      setIsCheckingAuth(false);
      return;
    }

    const restoreSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to restore session");
        }

        setUser(data.user);
        setStatusMessage(`Welcome back, ${data.user.name}.`);
      } catch (error) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    restoreSession();
  }, []);

  const openModal = (nextMode) => {
    setMode(nextMode);
    setIsModalOpen(true);
    setErrorMessage("");
    setStatusMessage("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");
    setIsSubmitting(true);

    const endpoint = mode === "login" ? "login" : "register";
    const payload =
      mode === "login"
        ? {
            email: formData.email,
            password: formData.password,
          }
        : formData;

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setUser(data.user);
      setStatusMessage(
        mode === "login"
          ? `You are logged in as ${data.user.name}.`
          : `Account created for ${data.user.name}.`
      );
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setStatusMessage("You have logged out.");
    setErrorMessage("");
    resetForm();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.65),_transparent_38%),linear-gradient(180deg,_#f7f2e7_0%,_#f2e5c9_42%,_#d8c4a0_100%)] text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8">
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
                onClick={handleLogout}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-amber-500 hover:text-amber-700"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => openModal("login")}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-amber-500 hover:text-amber-700"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => openModal("register")}
                className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-700"
              >
                Sign up
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 py-10">
          <section className="mb-10 overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 px-6 py-8 shadow-[0_18px_60px_rgba(93,64,55,0.15)] backdrop-blur sm:px-10">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                Simple mini games for relaxation and memory practice
              </p>
              <h2 className="text-4xl font-black leading-tight text-stone-900 sm:text-5xl">
                Welcome to a website with friendly and easy-to-use games
              </h2>
              {isCheckingAuth ? (
                <p className="mt-5 inline-flex rounded-full bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-700">
                  Checking your session...
                </p>
              ) : null}
              {statusMessage ? (
                <p className="mt-5 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
                  {statusMessage}
                </p>
              ) : null}
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <GameOneCard />
            <GameTwoCard />
            <GameThreeCard />
            <GameFourCard />
          </section>
        </main>
      </div>

      {isModalOpen ? (
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
                onClick={() => setIsModalOpen(false)}
                className="h-10 w-10 rounded-full border border-stone-300 text-lg font-semibold text-stone-700 transition hover:border-amber-600 hover:text-amber-700"
              >
                ×
              </button>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-full bg-stone-200 p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-stone-900 shadow"
                    : "text-stone-600"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-white text-stone-900 shadow"
                    : "text-stone-600"
                }`}
              >
                Sign up
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
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
                    onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
      ) : null}
    </div>
  );
}

export default App;
