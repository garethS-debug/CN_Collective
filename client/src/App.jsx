import { useCallback, useState } from "react";
import UserSidebar from "./components/UserSidebar.jsx";
import Header from "./components/Header.jsx";
import AuthModal from "./components/AuthModal.jsx";
import GamePreviewCard from "./components/GamePreviewCard.jsx";
import GameStage from "./components/GameStage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import useAuth from "./hooks/useAuth.js";
import useAvatarSelection from "./hooks/useAvatarSelection.js";

const RESULTS_API_URL =
  import.meta.env.VITE_RESULTS_API_URL || "http://127.0.0.1:5001/api/results";
const TOKEN_STORAGE_KEY = "mini-games-token";
const games = [
  {
    key: "memory_cards",
    title: "Memory Cards",
    subtitle: "Fruit pairs",
    description:
      "Flip the cards, match the fruit pairs and build your memory score.",
    icon: "🍓",
    accent: "bg-gradient-to-r from-amber-300 to-orange-300",
  },
  {
    key: "find_the_number",
    title: "Find The Number",
    subtitle: "Focus game",
    description:
      "A focus exercise with large controls and gentle pacing for easy play.",
    icon: "🔢",
    accent: "bg-gradient-to-r from-sky-300 to-cyan-300",
  },
  {
    key: "sequence_repeat",
    title: "Hangman",
    subtitle: "Word guessing",
    description:
      "Guess the hidden word by suggesting letters within a limited number of attempts.",
    icon: "🧠",
    accent: "bg-gradient-to-r from-emerald-300 to-lime-300",
  },
  {
    key: "reaction_tap",
    title: "Reaction Tap",
    subtitle: "Quick response",
    description:
      "Watch for the signal and tap at the right moment to improve reaction.",
    icon: "⚡",
    accent: "bg-gradient-to-r from-rose-300 to-pink-300",
  },
];

function App() {
  const [myResults, setMyResults] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [activeGame, setActiveGame] = useState(games[0]);
  const {
    avatars,
    selectedAvatar,
    selectedAvatarId,
    setSelectedAvatarId,
  } = useAvatarSelection();

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
    setCurrentView("home");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.65),_transparent_38%),linear-gradient(180deg,_#f7f2e7_0%,_#f2e5c9_42%,_#d8c4a0_100%)] text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8">
        <Header
          user={user}
          avatar={selectedAvatar}
          currentView={currentView}
          onHomeClick={() => setCurrentView("home")}
          onProfileClick={() => {
            if (!user) {
              openModal("login");
              return;
            }

            setCurrentView("profile");
          }}
          onLoginClick={() => openModal("login")}
          onRegisterClick={() => openModal("register")}
          onLogout={handleLogout}
        />

        <main className={`${currentView === "game" ? "flex-1 py-2" : "flex-1 py-10"}`}>
          {currentView === "home" ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <section className="page-shell mb-10 overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/70 px-6 py-8 shadow-[0_18px_60px_rgba(93,64,55,0.15)] backdrop-blur sm:px-10">
                  <div className="max-w-4xl">
                    <p className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                      Quiet games with large controls and warm motion
                    </p>
                    <h2 className="text-4xl font-black leading-tight text-stone-900 sm:text-6xl">
                      {user ? `Welcome ${user.name}` : "Welcome to calm play"}
                    </h2>
                    <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
                      Pick a card, open the game in a full-page view and keep
                      your scores in one place.
                    </p>
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

                <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {games.map((game) => (
                    <GamePreviewCard
                      key={game.key}
                      game={game}
                      onPlay={(nextGame) => {
                        setActiveGame(nextGame);
                        setCurrentView("game");
                      }}
                    />
                  ))}
                </section>
              </div>

              {user ? (
                <UserSidebar
                  user={user}
                  avatar={selectedAvatar}
                  myResults={myResults}
                  leaderboard={leaderboard}
                  isLoadingSidebar={isLoadingSidebar}
                />
              ) : null}
            </div>
          ) : null}

          {currentView === "game" ? (
            <GameStage
              game={activeGame}
              onBack={() => setCurrentView("home")}
              onResultSaved={() => {
                const token = localStorage.getItem(TOKEN_STORAGE_KEY);
                loadSidebarData(token);
              }}
            />
          ) : null}

          {currentView === "profile" && user ? (
            <ProfilePage
              user={user}
              avatar={selectedAvatar}
              avatars={avatars}
              selectedAvatarId={selectedAvatarId}
              onSelectAvatar={setSelectedAvatarId}
              myResults={myResults}
              leaderboard={leaderboard}
            />
          ) : null}
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
