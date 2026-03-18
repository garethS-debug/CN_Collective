import { useEffect, useState } from "react";

const avatarModules = import.meta.glob("../assets/avatars/*.{png,jpg,jpeg,svg}", {
  eager: true,
});

const avatars = Object.entries(avatarModules)
  .map(([path, module]) => {
    const match = path.match(/avatar-(\d+)\./);
    return {
      id: match ? Number(match[1]) : 0,
      src: module.default,
    };
  })
  .sort((first, second) => first.id - second.id);

const STORAGE_KEY = "mini-games-avatar-id";

function useAvatarSelection() {
  const [selectedAvatarId, setSelectedAvatarId] = useState(() => {
    const storedAvatarId = localStorage.getItem(STORAGE_KEY);
    return storedAvatarId ? Number(storedAvatarId) : avatars[0]?.id ?? null;
  });

  useEffect(() => {
    if (selectedAvatarId !== null) {
      localStorage.setItem(STORAGE_KEY, String(selectedAvatarId));
    }
  }, [selectedAvatarId]);

  const selectedAvatar =
    avatars.find((avatar) => avatar.id === selectedAvatarId) ?? avatars[0] ?? null;

  return {
    avatars,
    selectedAvatar,
    selectedAvatarId,
    setSelectedAvatarId,
  };
}

export default useAvatarSelection;
