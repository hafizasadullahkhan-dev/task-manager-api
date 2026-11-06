import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function AppContent() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {showLogin ? <Login /> : <Signup />}
        <p className="auth-switch">
          {showLogin ? "Account nahi hai? " : "Account hai? "}
          <button onClick={() => setShowLogin(!showLogin)}>
            {showLogin ? "Signup karo" : "Login karo"}
          </button>
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;