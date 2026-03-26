import { useCallback, useState } from "react";
import UserSidebar from "./components/UserSidebar.jsx";
import Header from "./components/Header.jsx";
import AuthModal from "./components/AuthModal.jsx";
import GamePreviewCard from "./components/GamePreviewCard.jsx";
import GameStage from "./components/GameStage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import useAuth from "./hooks/useAuth.js";
import useAvatarSelection from "./hooks/useAvatarSelection.js";
import websiteBanner from "./assets/banner/Banner3.png";

const RESULTS_API_URL =
  (typeof window !== "undefined" && window.__API && window.__API.RESULTS) ||
  import.meta.env.VITE_RESULTS_API_URL ||
  "http://127.0.0.1:5001/api/results";
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
    title: "Breakout",
    subtitle: "Arcade game",
    description:
      "Break the bricks, keep the ball in play and build your score.",
    icon: "🏓",
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
    key: "number_hunt",
    title: "Number Hunt",
    subtitle: "Find 1 to 30",
    description:
      "Find the scattered numbers in the correct order from 1 to 30.",
    icon: "🔎",
    accent: "bg-gradient-to-r from-cyan-300 to-blue-300",
  },
  {
    key: "fifteen_puzzle",
    title: "Fifteen Puzzle",
    subtitle: "Slide the tiles",
    description:
      "Move the tiles into the empty space and arrange the numbers from 1 to 15.",
    icon: "🔲",
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
      const [resultsResponse, ...leaderboardResponses] = await Promise.all([
        fetch(`${RESULTS_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        ...games.map((game) =>
          fetch(`${RESULTS_API_URL}/leaderboard/${game.key}`).then(
            async (response) => ({
              ok: response.ok,
              game,
              data: await response.json(),
            }),
          ),
        ),
      ]);

      const resultsData = await resultsResponse.json();

      if (resultsResponse.ok) {
        setMyResults(resultsData.results || []);
      }

      const combinedLeaderboard = leaderboardResponses
        .filter((entry) => entry.ok)
        .flatMap((entry) =>
          (entry.data.results || []).map((result) => ({
            ...result,
            game: result.game || {
              key: entry.game.key,
              title: entry.game.title,
            },
          })),
        )
        .sort((left, right) => {
          if (right.score !== left.score) {
            return right.score - left.score;
          }

          return left.duration - right.duration;
        });

      setLeaderboard(combinedLeaderboard);
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
    <div className="min-h-screen bg-white text-stone-900">
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
              <section className="page-shell mb-10 overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/70 shadow-[0_18px_60px_rgba(93,64,55,0.15)] backdrop-blur xl:col-span-2">
                {user ? (
                  <div className="px-6 py-8 sm:px-10 sm:py-10">
                    <div className="max-w-4xl">
                      <h2 className="text-4xl font-black leading-tight text-stone-900 sm:text-6xl">
                        Welcome to Elder Quest!
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
                  </div>
                ) : (
                  <div className="relative aspect-[2.55/1] min-h-[240px] w-full sm:min-h-[300px] lg:min-h-[360px]">
                    <img
                      src={websiteBanner}
                      alt="Calm Play banner"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                )}
              </section>

              <div>

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
