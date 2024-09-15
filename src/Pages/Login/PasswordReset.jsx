import { useState, useEffect } from "react";
import { getAuth, confirmPasswordReset } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import eye_icon from "../../assets/Icons/eye.png";

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetCode, setResetCode] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("oobCode");
    console.log("Reset code from URL:", code); // Debugging statement
    if (code) {
      setResetCode(code);
    } else {
      setError("Invalid or missing password reset code.");
    }
  }, [location.search]);

  const handlePasswordReset = async (event) => {
    event.preventDefault();

    if (!resetCode) {
      setError("Invalid or missing password reset code.");
      return;
    }

    try {
      console.log("Attempting to reset password with code:", resetCode); // Debugging statement
      await confirmPasswordReset(auth, resetCode, newPassword);
      setSuccess(
        "Password reset successful. You will be redirected to the login page shortly."
      );

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error during password reset:", error); // Debugging statement
      if (error.code === "auth/invalid-action-code") {
        setError(
          "The reset code is invalid or has expired. Please request a new password reset."
        );
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="login">
      <div className="login_tab">
        <div className="title">
          <span>Set new password</span>
          <span className="link" onClick={() => navigate("/login")}>
            Login <i className="icon fas fa-arrow-right"></i>
          </span>
        </div>

        <form onSubmit={handlePasswordReset}>
          <label htmlFor="new_password">New password</label>
          <div className="input">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              id="new_password"
              placeholder="******"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {newPassword && (
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="view_btn"
              >
                <img src={eye_icon} alt="view" />
              </button>
            )}
          </div>

          {error && <span className="error">{error}</span>}
          {success && <span className="success">{success}</span>}

          <button className="login_btn" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
