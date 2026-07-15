import React, { useState } from "react";
import AuthPage from "./AuthPage";
import SignupPage from "./SignupPage";

function App() {
  // "login" | "signup"
  const [view, setView] = useState("login");

  return (
    <div className="App">
      {view === "login" ? (
        <AuthPage onSwitchToRegister={() => setView("signup")} />
      ) : (
        <SignupPage onSwitchToLogin={() => setView("login")} />
      )}
    </div>
  );
}

export default App;
