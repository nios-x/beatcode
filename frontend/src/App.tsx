import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { SubmissionsPage } from "@/pages/SubmissionsPage";
import { SubmissionDetailPage } from "@/pages/SubmissionDetailPage";
import { PlaygroundPage } from "@/pages/PlaygroundPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { DailyPage } from "@/pages/DailyPage";
import { AppLayout } from "@/components/AppLayout";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function App() {
  const queryClient = new QueryClient()
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* App routes (with sidebar layout) */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/submissions" element={<SubmissionsPage />} />
            <Route path="/submissions/:id" element={<SubmissionDetailPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/daily" element={<DailyPage />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
