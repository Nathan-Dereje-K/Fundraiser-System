import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import Navbar from './components/Navbar';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import SignUp from './pages/signup';
import Campaigns from './pages/CampaignPage';
import Donate from './pages/Donate';
import BackgroundAnimation from './components/backgroundAnimation';
import Footer from './components/footer';
import NotFound from './pages/NotFound';
import Dashboard from './pages/dashboard';
import ValidatorDashboard from './pages/ValidatorDashboard';
import NotificationsPage from "./pages/Notificationspage";
//import Notification from "./components/notification";
import CampaignPage from "./pages/CampaignPage";
import { AuthProvider } from './auth/AuthContext';


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}> 
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <BackgroundAnimation />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/Campaigns" element={<Campaigns />} />
            <Route path="/Donate" element={<Donate />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/VaDashboard" element={<ValidatorDashboard />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/campaign/:campaignId" element={<CampaignPage />} />


          </Routes>

          <Footer />
        </div>
      </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;