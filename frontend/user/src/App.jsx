// ============================================
// FILE: frontend/user/src/App.jsx
// UPDATED - Added Notification Routes
// ============================================
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { SocketProvider } from "./context/SocketContext";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Freelancer Pages
import FreelancerDashboard from "./pages/FreelancerDashboard";
import FreelancerBrowseJobs from "./pages/FreelancerBrowseJobs";
import FreelancerJobs from "./pages/FreelancerJobs";
import FreelancerMessages from "./pages/FreelancerMessages";
import FreelancerWallet from "./pages/FreelancerWallet";
import FreelancerProfile from "./pages/FreelancerProfile";
import FreelancerJobDetails from "./pages/FreelancerJobDetails";
import FreelancerSettings from "./pages/FreelancerSettings";
import FreelancerHelp from "./pages/FreelancerHelp";
import FreelancerNotifications from "./pages/FreelancerNotifications"; // ✅ NEW

// Client Pages
import ClientDashboard from "./pages/ClientDashboard";
import ClientJobs from "./pages/ClientJobs";
import ClientHire from "./pages/ClientHire";
import ClientInbox from "./pages/ClientInbox";
import ClientFinances from "./pages/ClientFinances";
import ClientHelp from "./pages/ClientHelp";
import ClientSettings from "./pages/ClientSettings";
import ClientNotifications from "./pages/ClientNotifications"; // ✅ NEW

// Public Pages
const Home = () => <Login />;

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
      <p className="text-xl text-gray-600 mb-8">Unauthorized Access</p>
      <a href="/" className="text-blue-600 hover:underline">
        Go back home
      </a>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <a href="/" className="text-blue-600 hover:underline">
        Go back home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <SocketProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Freelancer Routes */}
        <Route
          path="/freelancer/dashboard"
          element={
            <ProtectedRoute requiredRole="freelancer" requiredUserType="user">
              <FreelancerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/browse-jobs"
          element={
            <ProtectedRoute requiredRole="freelancer" requiredUserType="user">
              <FreelancerBrowseJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/jobs"
          element={
            <ProtectedRoute requiredRole="freelancer" requiredUserType="user">
              <FreelancerJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/jobs/browse/:id"
          element={
            <ProtectedRoute requiredRole="freelancer" requiredUserType="user">
              <FreelancerJobDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/messages"
          element={
            <ProtectedRoute requiredRole="freelancer" requiredUserType="user">
              <FreelancerMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/wallet"
          element={
            <ProtectedRoute requiredRole="freelancer" requiredUserType="user">
              <FreelancerWallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/profile"
          element={
            <ProtectedRoute requiredRole="freelancer" requiredUserType="user">
              <FreelancerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/settings"
          element={
            <ProtectedRoute requiredRole="freelancer" requiredUserType="user">
              <FreelancerSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/help"
          element={
            <ProtectedRoute requiredRole="freelancer" requiredUserType="user">
              <FreelancerHelp />
            </ProtectedRoute>
          }
        />
        {/* ✅ NEW - Freelancer Notifications Route */}
        <Route
          path="/freelancer/notifications"
          element={
            <ProtectedRoute requiredRole="freelancer" requiredUserType="user">
              <FreelancerNotifications />
            </ProtectedRoute>
          }
        />

        {/* Client Routes */}
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute requiredRole="client" requiredUserType="user">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/jobs"
          element={
            <ProtectedRoute requiredRole="client" requiredUserType="user">
              <ClientJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/hire"
          element={
            <ProtectedRoute requiredRole="client" requiredUserType="user">
              <ClientHire />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/inbox"
          element={
            <ProtectedRoute requiredRole="client" requiredUserType="user">
              <ClientInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/finances"
          element={
            <ProtectedRoute requiredRole="client" requiredUserType="user">
              <ClientFinances />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/help"
          element={
            <ProtectedRoute requiredRole="client" requiredUserType="user">
              <ClientHelp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/settings"
          element={
            <ProtectedRoute requiredRole="client" requiredUserType="user">
              <ClientSettings />
            </ProtectedRoute>
          }
        />
        {/* ✅ NEW - Client Notifications Route */}
        <Route
          path="/client/notifications"
          element={
            <ProtectedRoute requiredRole="client" requiredUserType="user">
              <ClientNotifications />
            </ProtectedRoute>
          }
        />

        {/* Admin redirects to separate admin panel */}
        <Route
          path="/admin/*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
                <p className="text-gray-600 mb-4">
                  Admin panel is on a separate frontend at port 5174
                </p>
                <a
                  href="http://localhost:5174"
                  className="text-blue-600 hover:underline"
                >
                  Go to Admin Panel →
                </a>
              </div>
            </div>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;