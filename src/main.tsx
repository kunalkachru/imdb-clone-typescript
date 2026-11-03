// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.tsx";

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { WatchlistProvider } from "./context/WatchlistContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// ! tells TypeScript "trust me, this will never be null"
// safe here because index.html always has <div id="root">
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <WatchlistProvider>
            <App />
          </WatchlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>,
);
