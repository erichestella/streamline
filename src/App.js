import React, { useState } from "react";
import AuthPage from "./AuthPage";
import SignupPage from "./SignupPage";
import LivePreview from "./LivePreview";
import Dashboard from "./Dashboard";

function App() {
  const [view, setView] = useState("login");

  return (
    <div className="App">
      {view === "login" && (
        <AuthPage
          onSwitchToRegister={() => setView("signup")}
          onLoginSuccess={() => setView("dashboard")}
        />
      )}
      {view === "signup" && (
        <SignupPage onSwitchToLogin={() => setView("login")} />
      )}
      {view === "preview" && <LivePreview />}
      {view === "dashboard" && <Dashboard />}
    </div>
  );
}

export default App;