import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Watchlist from "./pages/Watchlist";
import Actors from "./pages/Actors";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/actors" element={<Actors />} />

          {/* <Route path="/watchlist" element={<Watchlist />} /> */}
          {/* Protected — only logged in users can access */}
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
