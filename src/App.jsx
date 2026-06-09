import { ConfigProvider } from 'antd';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserForm from './components/form/forms.jsx';
import { Login } from './components/auth/index.js';
import { AppShell } from './components/layouts/index.js';
import AppTypography from './components/typography/Typography.jsx';
import HomePage from './pages/HomePage.jsx';
import JobsPage from './pages/jobsPage.jsx';
import ZinnextDetailedView from './pages/common-detailedView.jsx';
import { colors } from './theme/colors/colors.js';
import { getStoredToken } from './services/dropdownApi.js';
import SubmissionsPage from './pages/Modules/SubmissionsPage.jsx';
import DashboardPage from './pages/Modules/DashboardPage.jsx';
import TestForm from './pages/TestingPage/test-form.jsx';
import TestingHomePage from './pages/TestingPage/testHomePage.jsx';
import LmsTestForm from './pages/TestingPage/lms-test-form.jsx';
import LmsHomePage from './pages/TestingPage/lmsHomePage.jsx';
import OnboardingHomePage from './pages/OnboardingHomePage.jsx';
import JobDetailView from './pages/SourceCandidatePage.jsx';
import JobDetailedView from './pages/JobDetailedView.jsx';
import SampleDetailedView from './pages/jobs-detailedView.jsx';
import CandidateDetailedView from './pages/candidate-detailedView.jsx';
import SubmissionDetailedView from './pages/submission-Detailedview.jsx';
import JobsDetailedView from './pages/jobs-detailedView.jsx';

import CandidateDetailView from './pages/Modules/Candidates/Candidatedetailview.jsx';
import CandidatePage from './pages/Modules/Candidates/CandidatePage.jsx';
import CandidateAddForm from './pages/Modules/Candidates/CandidateAddForm.jsx';
import AdminPage from "./pages/Modules/AdminPage.jsx";

function ProtectedRoute({ isAuthenticated, children }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function ModulePage({ title }) {
  return (
    <div>
      <AppTypography variant="h4" color="primary">
        {title}
      </AppTypography>
    </div>
  );
}

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    function handleLogout() {
      setIsAuthenticated(false);
    }

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  function handleLogin() {
    setIsAuthenticated(true);
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
      />
      <Route
        path="/"
        element={(
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppShell />
          </ProtectedRoute>
        )}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="homepage" element={<HomePage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="add" element={<UserForm />} />
        <Route path="candidates" element={<CandidatePage />} />
        <Route path="candidates/:id" element={<CandidateDetailView />} />
        <Route path="candidate-create" element={<CandidateAddForm />} />
        <Route path="submissions" element={<SubmissionsPage />} />
        <Route path="onboarding" element={<OnboardingHomePage />} />
        <Route path="network" element={<ModulePage title="Network" />} />
        <Route path="network/hotlist" element={<ModulePage title="Hotlist" />} />
        <Route path="network/vendors" element={<ModulePage title="Vendors" />} />
        <Route path="campaign" element={<ModulePage title="Campaign" />} />
        <Route path="scheduler" element={<ModulePage title="Scheduler" />} />
         <Route path="admin" element={<AdminPage />} /> 
        <Route path="admin" element={<ModulePage title="Admin" />} />
        <Route path="inbox" element={<ModulePage title="Inbox" />} />
        <Route path="my-profile" element={<ModulePage title="My Profile" />} />
        <Route path="zinnext-home" element={<TestingHomePage />} />
        <Route path="test-cases/zinnext" element={<TestForm />} />
        <Route path="test-cases/lms" element={<LmsTestForm />} />
        <Route path="lms-home" element={<LmsHomePage />} />
        {/* <Route path="test-cases" element={<TestingPage />} /> */}
        <Route path="test" element={<TestingHomePage />} />
        <Route path="detailedView" element={<ZinnextDetailedView />} />
        <Route path="source-candidate" element={<JobDetailView />} />
        <Route path="job-detailedView" element={<JobDetailedView />} />
        <Route path="jobs-detailedView" element={<JobsDetailedView />} />
        <Route path="candidate-detailedView" element={<CandidateDetailedView />} />
        <Route path="submission-detailedView" element={<SubmissionDetailedView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colors.brand,
          borderRadius: 8,
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          colorText: colors.textPrimary,
          colorTextSecondary: colors.textSecondary,
          colorBgLayout: colors.surfacePage,
          colorBgContainer: colors.surfaceCard,
          colorBorder: colors.border,
        },
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
}
