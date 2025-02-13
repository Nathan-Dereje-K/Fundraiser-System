import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import Home from "./pages/Home";
import CampaignCreation from "./pages/CampaignCreation";

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
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/campaignCreation"
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
