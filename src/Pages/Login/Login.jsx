import React, { useRef, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import eye_icon from "../../assets/Icons/eye.png";
import { loginWithGithub } from "./GithubLogin";
import { loginWithGoogle } from "./GoogleLogin";
import { useLocation } from "react-router-dom";

const Login = () => {
  const [page, setPage] = useState("login");
  const passwordRef = useRef(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(""); // Add state for username
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing errors when the component mounts or URL changes
    setError("");
    setSuccess("");
  }, [location]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (event.target.value.length < 6) {
      setError("Password must be at least 6 characters");
    } else {
      setError("");
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  useEffect(() => {
    if (page === "signup") {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
      } else if (password.length < 6) {
        setError("Password must be at least 6 characters");
      } else {
        setError("");
      }
    } else if (page === "login") {
      if (password.length < 6) {
        setError("Password must be 6 characters or more");
      } else {
        setError("");
      }
    }
  }, [password, confirmPassword]);

  //login with email and password
  const loginWithEmailPassword = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("login successful with email id", email);
      setSuccess("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setError("Login failed: " + error.message);
    }
  };

  const signUpwithEmailPassword = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the user's profile with the username
      await updateProfile(user, {
        displayName: username,
      });

      console.log("signup successful with email id", email);

      const userProfileRef = doc(db, "Profiles", user.uid);

      await setDoc(
        userProfileRef,
        {
          username: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
          uid: user.uid,
        },
        { merge: true }
      );

      setSuccess(
        "Sign-up successful! You will be redirected to the home page shortly."
      );

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setError("Sign-up failed: " + error.message);
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent!");
    } catch (error) {
      console.log(error);
      setError("Password reset email failed: " + error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Meshables</title>
        <meta name="description" content="Login with Google or GitHub" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Login | Meshables" />
        <meta property="og:description" content="Login with Google or GitHub" />
        <meta property="og:url" content="https://meshables.me/#/login" />
      </Helmet>
      {/* <div className="page_content"> */}
      <div className="login">
        {page === "login" && (
          <div className="login_tab">
            <div className="title">
              <span>Login</span>
              <span
                className="link"
                onClick={() => {
                  setPage("signup");
                  setError("");
                }}
              >
                Sign Up <i className="icon fas fa-arrow-right"></i>
              </span>
            </div>
            <form onSubmit={loginWithEmailPassword}>
              <label htmlFor="email">Email</label>
              <div className="input">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="example@mail.com"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>

              <label htmlFor="password">Password</label>

              <div className="input">
                <input
                  type={`${isPasswordVisible ? "text" : "password"}`}
                  id="password"
                  name="password"
                  ref={passwordRef}
                  placeholder="******"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />

                {password === "" ? (
                  ""
                ) : (
                  <button
                    // do not trigger form submission
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="view_btn"
                  >
                    <img src={eye_icon} alt="view" />
                  </button>
                )}
              </div>

              {
                <span
                  className="forgot_password"
                  onClick={() => {
                    setPage("forgot");
                    setError("");
                  }}
                >
                  <Link> Forgot password? </Link>
                </span>
              }

              {error && <span className="error">{error}</span>}
              {success && <span className="success">{success}</span>}

              <button className="login_btn" type="submit">
                Login
              </button>
              <div className="separator"></div>

              <div className="buttons">
                <button
                  className="google"
                  type="button"
                  onClick={loginWithGoogle}
                >
                  <i className="fab fa-google"></i>
                </button>
                <button
                  className="github"
                  type="button"
                  onClick={loginWithGithub}
                >
                  <i className="fab fa-github"></i>
                </button>
                <button className="apple" type="button">
                  <i className="fab fa-apple"></i>
                </button>
              </div>
            </form>
          </div>
        )}

        {page === "signup" && (
          <div className="login_tab">
            <div className="title">
              <span>Sign up</span>
              <span
                className="link"
                onClick={() => {
                  setPage("login");
                  setError("");
                }}
              >
                Login <i className="icon fas fa-arrow-right"></i>
              </span>
            </div>{" "}
            <form onSubmit={signUpwithEmailPassword}>
              <label htmlFor="username">Username</label>
              <div className="input">
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  placeholder="Username"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
              <label htmlFor="email">Email</label>
              <div className="input">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="example@mail.com"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <label htmlFor="password">Password</label>
              <div className="input">
                <input
                  type={`${isPasswordVisible ? "text" : "password"}`}
                  name="password"
                  ref={passwordRef}
                  placeholder="******"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />

                {password === "" ? (
                  ""
                ) : (
                  <button
                    // do not trigger form submission
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="view_btn"
                  >
                    <img src={eye_icon} alt="view" />
                  </button>
                )}
              </div>
              <label htmlFor="cnfpassword">Confirm password</label>
              <div className="input">
                <input
                  type={`${isPasswordVisible ? "text" : "password"}`}
                  id="cnfpassword"
                  name="cnfpassword"
                  placeholder="******"
                  required
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />

                {password === "" ? (
                  ""
                ) : (
                  <button
                    // do not trigger form submission
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="view_btn"
                  >
                    <img src={eye_icon} alt="view" />
                  </button>
                )}
              </div>

              {/* <span
                  className="forgot_password"
                  onClick={() => setPage("login")}
                >
                  <Link> Already user? </Link>
                </span> */}

              <div className="accept_terms">
                <input
                  type="checkbox"
                  id="accept"
                  required
                  onChange={(event) => {
                    setTermsAccepted(event.target.checked);
                  }}
                />
                <label htmlFor="accept">
                  I accept the{" "}
                  <Link to="/terms" target="_blank">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" target="_blank">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {error && <span className="error">{error}</span>}
              {success && <span className="success">{success}</span>}

              <button
                className={`login_btn ${
                  error || !termsAccepted ? "disabled" : ""
                }`}
                disabled={error || !termsAccepted}
                type="submit"
              >
                Sign up
              </button>

              <div className="separator"></div>
              <div className="buttons">
                <button
                  className="google"
                  type="button"
                  onClick={loginWithGoogle}
                >
                  <i className="fab fa-google"></i>
                </button>
                <button
                  className="github"
                  type="button"
                  onClick={loginWithGithub}
                >
                  <i className="fab fa-github"></i>
                </button>
                <button className="apple" type="button">
                  <i className="fab fa-apple"></i>
                </button>
              </div>
            </form>
          </div>
        )}

        {page === "forgot" && (
          <div className="login_tab">
            <div className="title">
              <span>Forgot Password</span>
              <span className="link" onClick={() => setPage("login")}>
                Login <i className="icon fas fa-arrow-right"></i>
              </span>
            </div>
            <form onSubmit={handlePasswordReset}>
              <label htmlFor="email">Email</label>
              <div className="input">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="example@mail.com "
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>

              {error && <span className="error">{error}</span>}
              {success && <span className="success">{success}</span>}

              <button className="login_btn" type="submit">
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
