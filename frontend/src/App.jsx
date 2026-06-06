import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import userStore from "./store/user";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="rounded-full w-8 h-8 animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const user = userStore((state) => state.user);
  const checkingAuth = userStore((state) => state.checkingAuth);

  if (checkingAuth) {
    return <LoadingScreen />;
  }

  return user ? children : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }) {
  const user = userStore((state) => state.user);
  const checkingAuth = userStore((state) => state.checkingAuth);

  if (checkingAuth) {
    return <LoadingScreen />;
  }

  return !user ? children : <Navigate to="/" replace />;
}

function App() {
  const checkAuth = userStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" />
    </>
  );
}

export default App;