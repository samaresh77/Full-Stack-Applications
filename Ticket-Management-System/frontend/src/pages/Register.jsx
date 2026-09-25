import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../services/api";


function Register() {

  const navigate = useNavigate();


  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [role, setRole] =
    useState("support");


  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =========================================================
  // REGISTER
  // =========================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    // =========================================================
    // VALIDATION
    // =========================================================

    if (username.trim().length < 3) {

      setError(
        "Username must be at least 3 characters."
      );

      return;
    }


    if (password.length < 8) {

      setError(
        "Password must be at least 8 characters."
      );

      return;
    }


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    if (
      role !== "admin" &&
      role !== "support"
    ) {

      setError(
        "Please select a valid account type."
      );

      return;
    }


    setLoading(true);


    try {

      const response =
        await api.post(
          "/auth/register",
          {
            username:
              username.trim(),

            password,

            role,
          }
        );


      console.log(
        "Registration response:",
        response.data
      );


      setSuccess(
        "Account created successfully! Redirecting to login..."
      );


      // Clear form
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setRole("support");


      setTimeout(() => {

        navigate(
          "/login",
          {
            replace: true,
          }
        );

      }, 1200);


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      if (
        error.response?.status === 400
      ) {

        setError(
          error.response?.data?.detail ||
          "Username already exists."
        );

      } else if (
        error.response?.status === 422
      ) {

        setError(
          error.response?.data?.detail ||
          "Please check your registration details."
        );

      } else {

        setError(
          error.response?.data?.detail ||
          "Unable to create account. Please try again."
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
          Create your account
        </h1>


        <p className="login-subtitle">
          Create your Mini Helpdesk account
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


        {/* Form */}

        <form
          onSubmit={handleSubmit}
        >

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
              autoComplete="username"
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
              autoComplete="new-password"
              required
              disabled={loading}
            />

          </div>


          {/* Confirm Password */}

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
              autoComplete="new-password"
              required
              disabled={loading}
            />

          </div>


          {/* =================================================
              ACCOUNT TYPE
          ================================================= */}

          <div className="form-group">

            <label htmlFor="register-role">
              Account Type
            </label>


            <select
              id="register-role"
              className="form-control"
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value
                )
              }
              disabled={loading}
              required
            >

              <option value="support">
                Support
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

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


        {/* Login Link */}

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
            Already have an account?
          </p>


          <Link
            to="/login"
            style={{
              color: "#2563eb",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>

        </div>

      </div>

    </div>
  );
}


export default Register;