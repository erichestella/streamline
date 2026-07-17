import React, { useState } from "react";
import AuthPage from "./AuthPage";
import SignupPage from "./SignupPage";
import LivePreview from "./LivePreview";
// import TryLivePreview from "./TryLivePreview";

function App() {
  // "login" | "signup" | "preview" change it to see the view
  const [view, setView] = useState("signup");

  return (
    <div className="App">
      {view === "login" && (
        <AuthPage onSwitchToRegister={() => setView("signup")} />
      )}
      {view === "signup" && (
        <SignupPage onSwitchToLogin={() => setView("login")} />
      )}
      {view === "preview" && <LivePreview />}
      {/* {view === "trylivepreview" && <TryLivePreview/>} */}
    </div>
  );
}

export default App;