import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
// import Home from "./pages/Home";
import { SignInPage } from "./pages/auth/SignIn";
import { SignUpPage } from "./pages/auth/SignUp";
import { UserProvider } from "./context/UserContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import CampaignPanel from "./pages/Campaign/CampaignPanel";
import CampaignCreation from "./pages/Campaign/CampaignCreation";
import ProfileManagement from "./pages/ProfileManagement";
import Settings from "./pages/Settings";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import PageError from "./pages/PageError";
import Landing from "./pages/User/Landing";
import ValidatorPanel from "./pages/validator/ValidatorPanel";
//this page is to request a password reset link
function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<Landing />} />

            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgotpassword" element={<ForgetPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/verifyemail" element={<VerifyEmail />} />

            <Route path="/campaign_panel" element={<CampaignPanel />} />
            <Route path="/campaign_creation" element={<CampaignCreation />} />
            <Route path="/validator_panel" element={<ValidatorPanel />} />
            <Route path="*" element={<PageError />} />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/users"
              element={
                <Layout>
                  <UserManagement />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <ProfileManagement />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <Settings />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
