import { motion } from "framer-motion";
import Input from "../components/Input.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { User, Mail, Lock, Loader } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter.jsx";
import { useAuthStore } from "../store/authStore.js";
import ReCAPTCHA from "react-google-recaptcha";



const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const { signup, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  function onChange(value) {
    console.log("Captcha value:", value);
    setRecaptchaToken(value);
  }

  const validateForm = () => {
    const errors = {};

    const usernameRegex = /^[A-Za-z\s]+$/;

    if (recaptchaToken === null) {
      errors.recaptcha = "Please complete the recaptcha";
    }

    if (!username) {
      errors.username = "Username is required";
    } else if (!usernameRegex.test(username)) {
      errors.username = "Username can only contain letters and spaces";
    }

    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email address";

    if (!password) errors.password = "Password is required";

    if (!confirmPassword)
      errors.confirmPassword = "Confirm password is required";

    if (password !== confirmPassword)
      errors.passwordMatch = "Passwords do not match";

    if (passwordStrength > 8)
      errors.passwordStrength = "Password must be Strong before signing up";

    if (!recaptchaToken) errors.recaptcha = "Please complete the recaptcha";

    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setFormErrors({});
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      console.log("Validation Errors:", errors);

      return;
    }

    try {
      if (error) {
        console.error("Signup error 123:", error); // Log error details
        return; // Stop further execution if there's an error
      } else if (!error) {
        await signup(email, password, username, recaptchaToken);
        navigate("/verify-email");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-transparent to-white bg-clip-text text-transparent">
          CREATE ACCOUNT
        </h2>
        <form onSubmit={handleSignUp}>
          <Input
            type="text"
            placeholder="Username"
            icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {formErrors.username && (
            <p className="text-red-500 font-bold text-sm">
              {formErrors.username}
            </p>
          )}
          <Input
            type="email"
            placeholder="Email Address"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {formErrors.email && (
            <p className="text-red-500  font-bold text-sm">
              {formErrors.email}
            </p>
          )}
          <PasswordInput
            type="password"
            placeholder="Password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {formErrors.password && (
            <p className="text-red-500 font-bold text-sm">
              {formErrors.password}
            </p>
          )}
          <PasswordInput
            type="password"
            placeholder="Confirm Password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {formErrors.confirmPassword && (
            <p className="text-red-500 font-bold text-sm">
              {formErrors.confirmPassword}
            </p>
          )}
          {formErrors.passwordMatch && (
            <p className="text-red-500 font-bold text-sm">
              {formErrors.passwordMatch}
            </p>
          )}
          <PasswordStrengthMeter
            password={password}
            onStrengthChange={setPasswordStrength}
          />
          {formErrors.passwordStrength && (
            <p className="text-red-500 font-bold text-sm">
              {formErrors.passwordStrength}
            </p>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="my-4 flex justify-center">
            <div className="bg-gray-900 rounded-lg shadow-lg p-4">
              <ReCAPTCHA
                sitekey = "6LcpaG0qAAAAADnO6V9qaRxiLFift88dKOTvAAfU"
                onChange={onChange}
                className="w-full"
              />
                 {formErrors.recaptcha && (
            <p className="text-red-500 font-bold text-sm">
              {formErrors.recaptcha}
            </p>
          )}
            </div>
          </div>
         
          
          ,
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-black to-gray-950 text-white 
                font-bold rounded-lg shadow-lg hover:from-gray-500
                hover:to-gray-800 focus:outline-double focus:outline-cyan-800 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
                focus:ring-offset-gray-800 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-800 bg-opacity-50 flex justify-center">
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
