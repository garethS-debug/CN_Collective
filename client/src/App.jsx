import { useCallback, useState } from "react";
import GameOneCard from "./components/GameOneCard.jsx";
import GameTwoCard from "./components/GameTwoCard.jsx";
import GameThreeCard from "./components/GameThreeCard.jsx";
import GameFourCard from "./components/GameFourCard.jsx";
import UserSidebar from "./components/UserSidebar.jsx";
import Header from "./components/Header.jsx";
import AuthModal from "./components/AuthModal.jsx";
import useAuth from "./hooks/useAuth.js";

const RESULTS_API_URL =
  import.meta.env.VITE_RESULTS_API_URL || "http://127.0.0.1:5001/api/results";
const TOKEN_STORAGE_KEY = "mini-games-token";

function App() {
  const [myResults, setMyResults] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false);

  const loadSidebarData = useCallback(async (token) => {
    if (!token) {
      setMyResults([]);
      setLeaderboard([]);
      return;
    }

    setIsLoadingSidebar(true);

    try {
      const [resultsResponse, leaderboardResponse] = await Promise.all([
        fetch(`${RESULTS_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${RESULTS_API_URL}/leaderboard/memory_cards`),
      ]);

      const [resultsData, leaderboardData] = await Promise.all([
        resultsResponse.json(),
        leaderboardResponse.json(),
      ]);

      if (resultsResponse.ok) {
        setMyResults(resultsData.results || []);
      }

      if (leaderboardResponse.ok) {
        setLeaderboard(leaderboardData.results || []);
      }
    } catch (error) {
      setMyResults([]);
      setLeaderboard([]);
    } finally {
      setIsLoadingSidebar(false);
    }
  }, []);

  const {
    user,
    statusMessage,
    isCheckingAuth,
    isModalOpen,
    mode,
    formData,
    errorMessage,
    isSubmitting,
    openModal,
    closeModal,
    setMode,
    handleChange,
    handleSubmit,
    logout,
  } = useAuth({
    onAuthenticated: loadSidebarData,
    onLoggedOut: () => {
      setMyResults([]);
      setLeaderboard([]);
    },
  });

  const handleLogout = () => {
    logout();
    setMyResults([]);
    setLeaderboard([]);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.65),_transparent_38%),linear-gradient(180deg,_#f7f2e7_0%,_#f2e5c9_42%,_#d8c4a0_100%)] text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8">
        <Header
          user={user}
          onLoginClick={() => openModal("login")}
          onRegisterClick={() => openModal("register")}
          onLogout={handleLogout}
        />

        <main className="flex-1 py-10">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div>
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

              <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
                <GameOneCard
                  onResultSaved={() => {
                    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
                    loadSidebarData(token);
                  }}
                />
                <GameTwoCard />
                <GameThreeCard />
                <GameFourCard />
              </section>
            </div>

            {user ? (
              <UserSidebar
                user={user}
                myResults={myResults}
                leaderboard={leaderboard}
                isLoadingSidebar={isLoadingSidebar}
              />
            ) : null}
          </div>
        </main>
      </div>

      <AuthModal
        isOpen={isModalOpen}
        mode={mode}
        formData={formData}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onModeChange={setMode}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
