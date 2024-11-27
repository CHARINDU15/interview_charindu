import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import OAuth from "../components/OAuth";
import ReCAPTCHA from "react-google-recaptcha";
import toast, { Toaster } from "react-hot-toast";
import logo from "../Images/logo.png";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login, error } = useAuthStore();
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (!recaptchaToken) {
      setErrorMessage("Please complete the recaptcha");
      return;
    }
    if (!isFormValid) {
      toast.error(
        "Please fill the fields and submit the reCAPTCHA to enable login"
      );
    }

    // Clear previous errors
    setErrorMessage("");
    try {
      await login(email, password, recaptchaToken);
    } catch (error) {
      console.error(error);
    }
  };

  function onChange(value) {
    console.log("Captcha value:", value);
    setRecaptchaToken(value);
  }

  const isFormValid = email && password && recaptchaToken;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <Toaster />
      <div className="p-8">
        <div className="flex flex-col items-center mb-2">
          <h1 className="text-4xl font-bold text-white">ClaveMaestra</h1>
          <p className="text-lg text-gray-400 italic">
            {"Unlocking Your Potential"}
          </p>
          <img
            src={logo}
            alt="ClaveMaestra Logo"
            className="h-48 w-auto mt-2"
          />
        </div>

        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-cyan-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {error && (
            <p className="text-red-500 text-sm font-semibold mb-4">{error}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}

          <div className="my-4 flex justify-center">
            <div className="bg-gray-900 rounded-lg shadow-lg p-4">
              <ReCAPTCHA
                sitekey="6LcpaG0qAAAAADnO6V9qaRxiLFift88dKOTvAAfU"
                onChange={onChange}
                className="w-full"
              />
            </div>
          </div>
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-black to-gray-950 text-white 
                font-bold rounded-lg shadow-lg hover:from-gray-500
                hover:to-gray-800 focus:outline-double focus:outline-cyan-800 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
                focus:ring-offset-gray-800 transition duration-200"
            whileHover={isFormValid ? { scale: 1.02 } : {}}
            whileTap={isFormValid ? { scale: 0.98 } : {}}
            disabled={!isFormValid}
            type="submit"
            //disabled={isLoading}
          >
            Login
          </motion.button>
        </form>

        <div className="flex flex-col mt-6">
          <OAuth />
        </div>
      </div>

      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          {" "}
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-cyan-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
export default LoginPage;
