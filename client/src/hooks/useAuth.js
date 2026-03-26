import { useEffect, useState } from "react";

const API_BASE_URL =
  (typeof window !== "undefined" && window.__API && window.__API.AUTH) ||
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5001/api/auth";
const TOKEN_STORAGE_KEY = "mini-games-token";

function useAuth({ onAuthenticated, onLoggedOut }) {
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
        await onAuthenticated?.(token);
      } catch (error) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    restoreSession();
  }, [onAuthenticated]);

  const openModal = (nextMode) => {
    setMode(nextMode);
    setIsModalOpen(true);
    setErrorMessage("");
    setStatusMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      await onAuthenticated?.(data.token);
      setStatusMessage(
        mode === "login"
          ? `You are logged in as ${data.user.name}.`
          : `Account created for ${data.user.name}.`
      );
      resetForm();
      closeModal();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setStatusMessage("You have logged out.");
    setErrorMessage("");
    resetForm();
    onLoggedOut?.();
  };

  return {
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
  };
}

export default useAuth;
