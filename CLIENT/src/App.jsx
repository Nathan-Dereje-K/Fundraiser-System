import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './i18n';
import { AuthProvider } from "./context/authContext";
import { SignInPage } from "./pages/auth/SignIn";
import { SignUpPage } from "./pages/auth/SignUp";
import { UserProvider } from "./context/UserContext";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ProfileManagement from "./pages/ProfileManagement";
import Settings from "./pages/Settings";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import PageError from "./pages/PageError";
import CampaignManager from "./pages/Manager/CampaignManager";
import WithdrawPage from "./pages/Withdraw/WithdrawPage";
import ValidatorPanel from "./pages/validator/ValidatorPanel";
import ForbiddenPage from "./components/layout/ForbiddenPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// User pages
import Landing from "./pages/User/Landing";
import Category from "./pages/User/Category";
import DonorProfile from "./pages/User/DonorProfile";

// Campaign pages
import CampaignCreation from "./pages/Campaign/CampaignCreation";
import CampaignDetails from "./pages/Campaign/CampaignDetails";
import CampaignPanel from "./pages/Campaign/CampaignPanel";

// ✅ Toastify imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const userRoutes = [
  {
    path: "/dashboard",
    component: Dashboard,
    roles: ["admin", "validator", "user", "manager"],
  },
  {
    path: "/users",
    component: UserManagement,
    roles: ["admin", "validator", "user", "manager"],
  },
  {
    path: "/profile",
    component: ProfileManagement,
    roles: ["admin", "validator", "user", "manager"],
  },
  {
    path: "/settings",
    component: Settings,
    roles: ["admin", "validator", "user", "manager"],
  },
  {
    path: "/withdraw",
    component: WithdrawPage,
    roles: ["user"],
  },
];

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<Landing />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />

            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgotpassword" element={<ForgetPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/verifyemail" element={<VerifyEmail />} />
            <Route path="/donor/:donorId" element={<DonorProfile />} />
            <Route
              path="/campaign_panel"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <CampaignPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaign_creation"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <CampaignCreation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/validator_panel"
              element={
                <ProtectedRoute allowedRoles={["validator"]}>
                  <ValidatorPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/category/:category_name"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Category />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaign_manager"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <CampaignManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/category/:categoryName/:id"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <CampaignDetails />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<PageError />} />
            {userRoutes.map(({ path, component: Component, roles }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute allowedRoles={roles}>
                    <Layout>
                      <Component />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            ))}
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
