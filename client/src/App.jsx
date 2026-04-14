import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import AdminRoute from "./guards/AdminRoute";
import GuestOnlyRoute from "./guards/GuestOnlyRoute";

import HomePage from "./pages/HomePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProjectsPage from "./pages/AdminProjectsPage";
import AdminSkillsPage from "./pages/AdminSkillsPage";
import AdminMessagesPage from "./pages/AdminMessagesPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <HelmetProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* Admin Login (guest only) */}
        <Route element={<GuestOnlyRoute />}>
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="skills" element={<AdminSkillsPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HelmetProvider>
  );
};

export default App;
