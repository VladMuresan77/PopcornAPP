import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthToggle = ({
  isLogin,
  setIsLogin,
}: {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <div className="flex justify-center mb-6">
    {["Login", "Sign Up"].map((mode, idx) => {
      const active = (isLogin && idx === 0) || (!isLogin && idx === 1);
      return (
        <button
          key={mode}
          onClick={() => setIsLogin(idx === 0)}
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            active ? "bg-gray-900 text-white" : "text-gray-800"
          }`}
          aria-pressed={active}
        >
          {mode}
        </button>
      );
    })}
  </div>
);

const InputField = ({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label className="block mb-4 text-gray-900">
    {label}
    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full mt-1 p-2 rounded bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-900"
    />
  </label>
);

const Login: React.FC = () => {
  const { login, signup, globalUser, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (globalUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h2 className="text-3xl mb-4">Hello: {globalUser.email}!</h2>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="bg-red-800 hover:bg-red-500 px-6 py-2 rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-md">
        <AuthToggle isLogin={isLogin} setIsLogin={setIsLogin} />

        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl mb-6 text-gray-900 font-semibold text-center">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

          <InputField label="Email:" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField label="Password:" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
