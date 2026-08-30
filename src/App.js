import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';

import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home.js';
import Login from './pages/Login';
import RegisterClient from './pages/RegisterClient';
import RegisterShopper from './pages/RegisterShopper';
import ForgotPassword from './pages/ForgotPassword';

// Legal pages (public)
import CGU from './pages/CGU';
import CGV from './pages/CGV';
import MentionsLegales from './pages/MentionsLegales';
import Confidentialite from './pages/Confidentialite';
import Cookies from './pages/Cookies';
import Regles from './pages/Regles';
import Suspension from './pages/Suspension';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Support from './pages/Support';
import HowItWorks from './pages/HowItWorks';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

// Client pages (role = client)
import ClientHome from './pages/ClientHome';
import Catalogue from './pages/Catalogue';
import ArticleDetail from './pages/ArticleDetail';
import DeposerDemande from './pages/DeposerDemande';
import Messages from './pages/Messages';
import Suivi from './pages/Suivi';
import Profil from './pages/Profil';

// Shopper pages (role = shopper)
import ShopperHome from './pages/ShopperHome';
import Marche from './pages/Marche';
import DemandeDetail from './pages/DemandeDetail';
import MesArticles from './pages/MesArticles';
import ShopperMessages from './pages/ShopperMessages';
import ShopperSuivi from './pages/ShopperSuivi';
import ShopperProfil from './pages/ShopperProfil';
import ShopperGains from './pages/ShopperGains';

// Admin pages (role = admin)
import AdminShoppers from './pages/AdminShoppers';
import AdminClients from './pages/AdminClients';
import AdminTransactions from './pages/AdminTransactions';
import AdminLitiges from './pages/AdminLitiges';
import AdminSignalements from './pages/AdminSignalements';
import AdminParametres from './pages/AdminParametres';
import AdminUtilisateurs from './pages/AdminUtilisateurs';
import AdminDemandes from './pages/AdminDemandes';
import AdminCommandes from './pages/AdminCommandes';

// Dev-only: preview of the shadcn/ui AnimatedDrawer component
import AnimatedDrawer from './components/ui/animated-drawer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/client" element={<RegisterClient />} />
        <Route path="/register/shopper" element={<RegisterShopper />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Legal */}
        <Route path="/cgu" element={<CGU />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/regles" element={<Regles />} />
        <Route path="/suspension" element={<Suspension />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* Client (protected) */}
        <Route path="/client/home" element={
          <ProtectedRoute requiredRole="client"><ClientHome /></ProtectedRoute>
        } />
        <Route path="/catalogue" element={
          <ProtectedRoute requiredRole="client"><Catalogue /></ProtectedRoute>
        } />
        <Route path="/article/:id" element={
          <ProtectedRoute requiredRole="client"><ArticleDetail /></ProtectedRoute>
        } />
        <Route path="/deposer-demande" element={
          <ProtectedRoute requiredRole="client"><DeposerDemande /></ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute requiredRole="client"><Messages /></ProtectedRoute>
        } />
        <Route path="/client/suivi" element={
          <ProtectedRoute requiredRole="client"><Suivi /></ProtectedRoute>
        } />
        <Route path="/client/profil" element={
          <ProtectedRoute requiredRole="client"><Profil /></ProtectedRoute>
        } />

        {/* Shopper (protected) */}
        <Route path="/shopper/home" element={
          <ProtectedRoute requiredRole="shopper"><ShopperHome /></ProtectedRoute>
        } />
        <Route path="/shopper/marche" element={
          <ProtectedRoute requiredRole="shopper"><Marche /></ProtectedRoute>
        } />
        <Route path="/shopper/demande/:id" element={
          <ProtectedRoute requiredRole="shopper"><DemandeDetail /></ProtectedRoute>
        } />
        <Route path="/shopper/articles" element={
          <ProtectedRoute requiredRole="shopper"><MesArticles /></ProtectedRoute>
        } />
        <Route path="/shopper/messages" element={
          <ProtectedRoute requiredRole="shopper"><ShopperMessages /></ProtectedRoute>
        } />
        <Route path="/shopper/suivi" element={
          <ProtectedRoute requiredRole="shopper"><ShopperSuivi /></ProtectedRoute>
        } />
        <Route path="/shopper/profil" element={
          <ProtectedRoute requiredRole="shopper"><ShopperProfil /></ProtectedRoute>
        } />
        <Route path="/shopper/gains" element={
          <ProtectedRoute requiredRole="shopper"><ShopperGains /></ProtectedRoute>
        } />

        {/* Admin (protected) */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/shoppers" element={
          <ProtectedRoute requiredRole="admin"><AdminShoppers /></ProtectedRoute>
        } />
        <Route path="/admin/clients" element={
          <ProtectedRoute requiredRole="admin"><AdminClients /></ProtectedRoute>
        } />
        <Route path="/admin/transactions" element={
          <ProtectedRoute requiredRole="admin"><AdminTransactions /></ProtectedRoute>
        } />
        <Route path="/admin/litiges" element={
          <ProtectedRoute requiredRole="admin"><AdminLitiges /></ProtectedRoute>
        } />
        <Route path="/admin/signalements" element={
          <ProtectedRoute requiredRole="admin"><AdminSignalements /></ProtectedRoute>
        } />
        <Route path="/admin/parametres" element={
          <ProtectedRoute requiredRole="admin"><AdminParametres /></ProtectedRoute>
        } />
        <Route path="/admin/utilisateurs" element={
          <ProtectedRoute requiredRole="admin"><AdminUtilisateurs /></ProtectedRoute>
        } />
        <Route path="/admin/demandes" element={
          <ProtectedRoute requiredRole="admin"><AdminDemandes /></ProtectedRoute>
        } />
        <Route path="/admin/commandes" element={
          <ProtectedRoute requiredRole="admin"><AdminCommandes /></ProtectedRoute>
        } />

        {/* Dev preview */}
        <Route
          path="/dev/drawer"
          element={
            <div className="flex min-h-screen items-center justify-center bg-neutral-50">
              <AnimatedDrawer />
            </div>
          }
        />

        {/* Fallback */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
