import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import Home from "./pages/Home";
import CampaignCreation from "./pages/Campaign/CampaignCreation";
import Validator from "./pages/Validator";
import Error from "./pages/Error";
import Admin from "./pages/Admin";
import CampaignPanel from "./pages/Campaign/CampaignPanel";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/campaign_panel" element={<CampaignPanel />} />

        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/validator" element={<Validator />} />
        <Route path="*" element={<Error />} />

        <Route
          path="/campaign_creation"
          element={
            <ProtectedRoute>
              <CampaignCreation />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
