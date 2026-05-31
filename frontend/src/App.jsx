import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Pages ──────────────────────────────────────
import HomePage          from "./pages/HomePage";
import CitiesPage        from "./pages/CitiesPage";
import CityDetailPage    from "./pages/CityDetailPage";
import RouteDetailPage   from "./pages/RouteDetailPage";
import FullscreenMapPage from "./pages/FullscreenMapPage";
import TheoryPage        from "./pages/TheoryPage";
import RoadSignsPage     from "./pages/RoadSignsPage";
import SignsCategoryPage from "./pages/SignsCategoryPage";
import ProfilePage       from "./pages/ProfilePage";
import LoginPage         from "./pages/LoginPage";
import PremiumPage       from "./pages/PremiumPage";
import AdminPage         from "./pages/AdminPage";


// ── Auth helpers ───────────────────────────────
const isLoggedIn = () => !!localStorage.getItem("jwt");

// ── Protected Route ────────────────────────────
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

// ── App ────────────────────────────────────────
export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) { setReady(true); return; }

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.token) {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Auth ── */}
        <Route path="/login" element={<LoginPage />} />
        {/* ── ადმინ ფეიჯი ── */}
        <Route path="/admin" element={<AdminPage />} />

        {/* ── Home ── */}
        <Route path="/" element={<HomePage />} />

        {/* ── Cities & Routes ── */}
        <Route path="/cities"                              element={<CitiesPage />} />
        <Route path="/cities/:cityId"                      element={<CityDetailPage />} />
        <Route path="/cities/:cityId/routes/:routeId"      element={<RouteDetailPage />} />
        <Route path="/cities/:cityId/routes/:routeId/map"  element={<FullscreenMapPage />} />

        {/* ── Theory ── */}
        <Route path="/theory" element={<TheoryPage />} />

        {/* ── Road Signs ── */}
        <Route path="/signs"              element={<RoadSignsPage />} />
        <Route path="/signs/:categoryId"  element={<SignsCategoryPage />} />

        {/* ── Profile (protected) ── */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
         {/* ── პრემიუმ ფეიჯი ── */}
        <Route path="/premium" element={<PremiumPage />} />
         

        {/* ── 404 → home ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
