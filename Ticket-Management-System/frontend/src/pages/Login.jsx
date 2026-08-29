import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Login() {
  const navigate = useNavigate();

  const {
    login,
    user,
  } = useAuth();


  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =========================================================
  // REDIRECT IF ALREADY LOGGED IN
  // =========================================================

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


  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const loggedInUser =
        await login(
          username,
          password
        );


      if (
        loggedInUser.role === "admin"
      ) {
        navigate("/admin");
      } else {
        navigate("/support");
      }

    } catch (error) {

      console.error(error);


      if (
        error.response?.status === 401
      ) {
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


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="login-page">

      <div className="login-card">

        {/* Logo */}

        <div className="login-logo">
          H
        </div>


        {/* Heading */}

        <h1>
          Welcome back
        </h1>

        <p className="login-subtitle">
          Sign in to your Mini Helpdesk account
        </p>


        {/* Error */}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}


        {/* Login Form */}

        <form onSubmit={handleSubmit}>

          {/* Username */}

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
                setUsername(
                  event.target.value
                )
              }
              autoComplete="username"
              required
              disabled={loading}
            />

          </div>


          {/* Password */}

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
                setPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
              required
              disabled={loading}
            />

          </div>


          {/* Submit */}

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


        {/* Register */}

        <div
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop:
              "1px solid #edf0f4",
            textAlign: "center",
          }}
        >

          <p
            style={{
              marginBottom: "7px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Don't have an account?
          </p>


          <Link
            to="/register"
            style={{
              color: "#2563eb",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Create an account
          </Link>

        </div>

      </div>

    </div>
  );
}


export default Login;