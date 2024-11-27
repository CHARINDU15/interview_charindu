import { Navigate, Route, Routes } from "react-router-dom";
import "../src/index.css";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "../src/pages/SignUpPage";
import LoginPage from "../src/pages/LoginPage";
import EmailVerificationPage from "../src/pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

import PropTypes from "prop-types";
import DashBoardPage from "./pages/DashBoardPage";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResourcePage from "./pages/ResourcePage";
import LogPage from "./pages/LogPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  RedirectAuthenticatedUser.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth().catch((error) => console.log(error));
  }, [checkAuth]);
  console.log("user", user);
  console.log("isAuthenticated", isAuthenticated);
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br 
      from-black via-gray-950 to-gray-900 flex items-center justify-center relative overflow-hidden"
      >
        {/* Floating shapes for depth */}
        <FloatingShape
          color="bg-gray-900"
          size="w-64 h-64"
          top="-5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-gray-700"
          size="w-48 h-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <FloatingShape
          color="bg-gray-600"
          size="w-32 h-32"
          top="40%"
          left="10%"
          delay={2}
        />
        <FloatingShape
          color="bg-gray-500"
          size="w-12 h-12"
          top="10%"
          left="80%"
          delay={1}
        />
        <FloatingShape
          color="bg-white"
          size="w-24 h-24"
          top="40%"
          left="10%"
          delay={2}
        />

        {/* Additional "star" shapes */}
        <FloatingShape
          color="bg-white"
          size="w-8 h-8"
          top="20%"
          left="25%"
          delay={0.5}
        />
        <FloatingShape
          color="bg-white"
          size="w-4 h-4"
          top="30%"
          left="50%"
          delay={1}
        />
        <FloatingShape
          color="bg-white"
          size="w-6 h-6"
          top="80%"
          left="30%"
          delay={1.5}
        />
        <FloatingShape
          color="bg-white"
          size="w-5 h-5"
          top="60%"
          left="70%"
          delay={2}
        />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashBoardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <ResourcePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <LogPage />
              </ProtectedRoute>
            }
          />
          {/* catch all routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
