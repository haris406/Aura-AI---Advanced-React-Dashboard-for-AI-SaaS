import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./lib/theme";
import { AppLayout } from "./components/AppLayout";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import ImagesPage from "./pages/ImagesPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import DocsPage from "./pages/DocsPage";

// HashRouter works reliably with the single-file build output
const Router = HashRouter;

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<Navigate to="/#pricing" replace />} />
          <Route
            path="/app/*"
            element={
              <AppLayout>
                <Routes>
                  <Route index element={<Navigate to="chat" replace />} />
                  <Route path="chat" element={<ChatPage />} />
                  <Route path="images" element={<ImagesPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="docs" element={<DocsPage />} />
                  <Route path="*" element={<Navigate to="chat" replace />} />
                </Routes>
              </AppLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
