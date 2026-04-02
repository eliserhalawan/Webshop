import { useState } from "react";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async () => {
    setMessage("");

    if (!username || !password) {
      setIsError(true);
      setMessage("Please fill in all fields.");
      return;
    }

    const endpoint = isLogin ? "/api/login" : "/api/signup";

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // save token and tell App.jsx the user is logged in
          localStorage.setItem("token", data.token);
          onLoginSuccess(data.username);
          onClose();
        } else {
          // after signup, switch to login form
          setIsError(false);
          setMessage("Account created! You can now log in.");
          setIsLogin(true);
          setPassword("");
        }
      } else {
        setIsError(true);
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setIsError(true);
      setMessage("Could not connect to the server.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm relative">

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your username"
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your password"
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Feedback message */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            isError
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}>
            {message}
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {isLogin ? "Log in" : "Sign up"}
        </button>

        {/* Toggle login/signup */}
        <p className="text-center text-sm text-gray-500 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
              setPassword("");
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-700 flex items-center justify-center transition"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

      </div>
    </div>
  );
}
