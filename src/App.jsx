import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import LegacyPortal from './components/LegacyPortal';

function HomePage() {
  return <LegacyPortal startView="home" />;
}

function AboutPage() {
  return <LegacyPortal startView="about" />;
}

function FindPage() {
  return <LegacyPortal startView="find" />;
}

function ApptPage() {
  return <LegacyPortal startView="appt" />;
}

function CampsPage() {
  return <LegacyPortal startView="camps" />;
}

function ComplaintsPage() {
  return <LegacyPortal startView="griev" />;
}

function FaqPage() {
  return <LegacyPortal startView="faq" />;
}

function DashboardsHubPage() {
  return <LegacyPortal startView="mods" />;
}

function ModuleDashboardPage() {
  const { mod } = useParams();
  return <LegacyPortal startView="mod" startMod={mod} />;
}

function RoleDashboardPage() {
  const { role } = useParams();
  return <LegacyPortal startView={`role:${role}`} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/find-healthcare" element={<FindPage />} />
      <Route path="/book-appointment" element={<ApptPage />} />
      <Route path="/health-camps" element={<CampsPage />} />
      <Route path="/complaints" element={<ComplaintsPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/health-dashboards" element={<DashboardsHubPage />} />
      <Route path="/dashboard/:mod" element={<ModuleDashboardPage />} />
      <Route path="/role/:role" element={<RoleDashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
