import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Login() {
  const navigate = useNavigate();

  const {
    login,
    user,
  } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  if (user) {
    return (
      <Navigate
        to={
          user.role === "admin"
            ? "/admin"
            : "/support"
        }
        replace
      />
    );
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const loggedInUser =
        await login(username, password);

      if (loggedInUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/support");
      }

    } catch (error) {
      if (error.response?.status === 401) {
        setError(
          "Invalid username or password."
        );
      } else {
        setError(
          "Unable to sign in. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          H
        </div>

        <h1>
          Welcome back
        </h1>

        <p className="login-subtitle">
          Sign in to your Mini Helpdesk account
        </p>


        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              className="form-control"
              type="text"
              value={username}
              placeholder="Enter your username"
              onChange={(event) =>
                setUsername(event.target.value)
              }
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              className="form-control"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />

          </div>


          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>

        </form>

      </div>

    </div>
  );
}


export default Login;