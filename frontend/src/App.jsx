import { Route, Routes } from 'react-router';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import JourneyPage from './pages/JourneyPage';
import SafeHubsPage from './pages/SafeHubsPage';
import ReportPage from './pages/ReportPage';
import CommunityPage from './pages/CommunityPage';
import EmergencyPage from './pages/EmergencyPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="journey" element={<JourneyPage />} />
        <Route path="safe-hubs" element={<SafeHubsPage />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="emergency" element={<EmergencyPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
