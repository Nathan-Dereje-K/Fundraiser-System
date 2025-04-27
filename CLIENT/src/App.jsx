import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

// User pages
import Landing from "./pages/User/Landing";
import Category from "./pages/User/Category";
import DonorProfile from "./pages/User/DonorProfile";
import Terms from "./pages/User/Terms";
import AboutUs from "./pages/User/AboutUs";

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
  },
  {
    path: "/users",
    component: UserManagement,
  },
  {
    path: "/profile",
    component: ProfileManagement,
  },
  {
    path: "/settings",
    component: Settings,
  },
  {
    path: "/withdraw",
    component: WithdrawPage,
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

            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgotpassword" element={<ForgetPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/verifyemail" element={<VerifyEmail />} />
            <Route path="/campaign_panel" element={<CampaignPanel />} />
            <Route path="/campaign_creation" element={<CampaignCreation />} />
            <Route path="/validator_panel" element={<ValidatorPanel />} />
            <Route path="/donor/:donorId" element={<DonorProfile />} />
            <Route path="/category/:category_name" element={<Category />} />
            <Route path="/campaign_manager" element={<CampaignManager />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about_us" element={<AboutUs />} />

            {/* User routes */}
            <Route
              path="/category/:categoryName/:id"
              element={<CampaignDetails />}
            />

            <Route path="*" element={<PageError />} />
            {userRoutes.map(({ path, component: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <Layout>
                    <Component />
                  </Layout>
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
