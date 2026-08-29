import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";


function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    // Check passwords

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }


    // Check password length

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }


    setLoading(true);


    try {
      await api.post(
        "/auth/register",
        {
          username,
          password,
        }
      );


      setSuccess(
        "Account created successfully! Redirecting to login..."
      );


      setTimeout(() => {
        navigate("/login");
      }, 1200);


    } catch (error) {
      console.error(error);


      if (
        error.response?.status === 400
      ) {
        setError(
          error.response.data.detail ||
          "Username already exists."
        );

      } else if (
        error.response?.status === 422
      ) {
        setError(
          "Please check your username and password."
        );

      } else {
        setError(
          "Unable to create account. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <div className="login-card">

        {/* Logo */}

        <div className="login-logo">
          H
        </div>


        {/* Heading */}

        <h1>
          Create your account
        </h1>

        <p className="login-subtitle">
          Join Mini Helpdesk and start
          creating support tickets.
        </p>


        {/* Error */}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}


        {/* Success */}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          {/* Username */}

          <div className="form-group">

            <label htmlFor="register-username">
              Username
            </label>

            <input
              id="register-username"
              className="form-control"
              type="text"
              value={username}
              placeholder="Choose a username"
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              minLength={3}
              maxLength={50}
              required
              disabled={loading}
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              className="form-control"
              type="password"
              value={password}
              placeholder="At least 8 characters"
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              minLength={8}
              maxLength={72}
              required
              disabled={loading}
            />

          </div>


          {/* Confirm password */}

          <div className="form-group">

            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              className="form-control"
              type="password"
              value={confirmPassword}
              placeholder="Enter your password again"
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              minLength={8}
              maxLength={72}
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
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* Login link */}

        <p
          style={{
            marginTop: "22px",
            marginBottom: 0,
            textAlign: "center",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}

          <Link
            to="/login"
            style={{
              color: "#2563eb",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>

        </p>

      </div>

    </div>
  );
}


export default Register;