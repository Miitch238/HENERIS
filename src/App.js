import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './styles/global.css';

import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import RegisterClient from './pages/RegisterClient';
import RegisterShopper from './pages/RegisterShopper';
import ForgotPassword from './pages/ForgotPassword';
import Favoris from './pages/Favoris';
import Notifications from './pages/Notifications';
import Catalogue from './pages/Catalogue';
import Categorie from './pages/Categorie';
import PersonalShoppers from './pages/PersonalShoppers';  // ← ajouté
import Avis from './pages/Avis';

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

import ClientHome from './pages/ClientHome';
import ArticleDetail from './pages/ArticleDetail';
import DeposerDemande from './pages/DeposerDemande';
import Messages from './pages/Messages';
import Suivi from './pages/Suivi';
import Profil from './pages/Profil';

import ShopperHome from './pages/ShopperHome';
import ShopperDemandes from './pages/ShopperDemandes';
import DemandeDetail from './pages/DemandeDetail';
import ShopperClients from './pages/ShopperClients';
import ShopperCommandes from './pages/ShopperCommandes';
import ShopperVitrine from './pages/ShopperVitrine';
import ShopperMessages from './pages/ShopperMessages';
import ShopperNotifications from './pages/ShopperNotifications';
import ShopperProfil from './pages/ShopperProfil';
import ShopperGains from './pages/ShopperGains';
import AdminShoppers from './pages/AdminShoppers';
import AdminClients from './pages/AdminClients';
import AdminTransactions from './pages/AdminTransactions';
import AdminLitiges from './pages/AdminLitiges';
import AdminSignalements from './pages/AdminSignalements';
import AdminParametres from './pages/AdminParametres';
import AdminUtilisateurs from './pages/AdminUtilisateurs';
import AdminDemandes from './pages/AdminDemandes';
import AdminCommandes from './pages/AdminCommandes';
import Confiance from './pages/Confiance';

// Remet le défilement en haut à chaque changement de route — sans ça, HashRouter
// garde la position de scroll précédente, ce qui donne l'impression d'atterrir
// "en bas de page" quand on clique un lien situé loin dans une longue page.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>

        {/* ── HOME ── */}
        <Route path="/" element={<Home />} />

        {/* ── AUTH ── */}
        <Route path="/login"            element={<Login />} />
        <Route path="/register/client"  element={<RegisterClient />} />
        <Route path="/register/shopper" element={<RegisterShopper />} />
        <Route path="/forgot-password"  element={<ForgotPassword />} />

        {/* ── PAGES STANDALONE ── */}
        <Route path="/favoris"          element={<Favoris />} />
        <Route path="/notifications"    element={<Notifications />} />
        <Route path="/personal-shoppers" element={<PersonalShoppers />} />  {/* ← ajouté */}
        <Route path="/avis"             element={<Avis />} />               {/* ← déplacé ici */}
        <Route path="/confiance"        element={<Confiance />} />

        {/* ── CATALOGUE ── */}
        <Route path="/catalogue"             element={<Catalogue />} />
        <Route path="/catalogue/:categorie"  element={<Categorie />} />

        {/* ── PAGES PUBLIQUES avec PublicLayout ── */}
        <Route element={<PublicLayout />}>
          <Route path="/cgu"              element={<CGU />} />
          <Route path="/cgv"              element={<CGV />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite"  element={<Confidentialite />} />
          <Route path="/cookies"          element={<Cookies />} />
          <Route path="/regles"           element={<Regles />} />
          <Route path="/suspension"       element={<Suspension />} />
          <Route path="/faq"              element={<FAQ />} />
          <Route path="/contact"          element={<Contact />} />
          <Route path="/support"          element={<Support />} />
          <Route path="/how-it-works"     element={<HowItWorks />} />
          <Route path="/dashboard"        element={<Dashboard />} />
        </Route>

        {/* ── CLIENT (protected) ── */}
        <Route path="/client/home"     element={<ProtectedRoute requiredRole="client"><ClientHome /></ProtectedRoute>} />
        <Route path="/article/:id"     element={<ProtectedRoute requiredRole="client"><ArticleDetail /></ProtectedRoute>} />
        <Route path="/deposer-demande" element={<ProtectedRoute requiredRole="client"><DeposerDemande /></ProtectedRoute>} />
        <Route path="/messages"        element={<ProtectedRoute requiredRole="client"><Messages /></ProtectedRoute>} />
        <Route path="/client/suivi"    element={<ProtectedRoute requiredRole="client"><Suivi /></ProtectedRoute>} />
        <Route path="/client/profil"   element={<ProtectedRoute requiredRole="client"><Profil /></ProtectedRoute>} />

        {/* ── SHOPPER (protected) ── */}
        <Route path="/shopper/home"        element={<ProtectedRoute requiredRole="shopper"><ShopperHome /></ProtectedRoute>} />
        <Route path="/shopper/demandes"    element={<ProtectedRoute requiredRole="shopper"><ShopperDemandes /></ProtectedRoute>} />
        <Route path="/shopper/demande/:id" element={<ProtectedRoute requiredRole="shopper"><DemandeDetail /></ProtectedRoute>} />
        <Route path="/shopper/clients"     element={<ProtectedRoute requiredRole="shopper"><ShopperClients /></ProtectedRoute>} />
        <Route path="/shopper/commandes"   element={<ProtectedRoute requiredRole="shopper"><ShopperCommandes /></ProtectedRoute>} />
        <Route path="/shopper/vitrine"     element={<ProtectedRoute requiredRole="shopper"><ShopperVitrine /></ProtectedRoute>} />
        <Route path="/shopper/messages"    element={<ProtectedRoute requiredRole="shopper"><ShopperMessages /></ProtectedRoute>} />
        <Route path="/shopper/notifications" element={<ProtectedRoute requiredRole="shopper"><ShopperNotifications /></ProtectedRoute>} />
        <Route path="/shopper/profil"      element={<ProtectedRoute requiredRole="shopper"><ShopperProfil /></ProtectedRoute>} />
        <Route path="/shopper/gains"       element={<ProtectedRoute requiredRole="shopper"><ShopperGains /></ProtectedRoute>} />

        {/* ── ADMIN (protected) ── */}
        <Route path="/admin/dashboard"    element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/shoppers"     element={<ProtectedRoute requiredRole="admin"><AdminShoppers /></ProtectedRoute>} />
        <Route path="/admin/clients"      element={<ProtectedRoute requiredRole="admin"><AdminClients /></ProtectedRoute>} />
        <Route path="/admin/transactions" element={<ProtectedRoute requiredRole="admin"><AdminTransactions /></ProtectedRoute>} />
        <Route path="/admin/litiges"      element={<ProtectedRoute requiredRole="admin"><AdminLitiges /></ProtectedRoute>} />
        <Route path="/admin/signalements" element={<ProtectedRoute requiredRole="admin"><AdminSignalements /></ProtectedRoute>} />
        <Route path="/admin/parametres"   element={<ProtectedRoute requiredRole="admin"><AdminParametres /></ProtectedRoute>} />
        <Route path="/admin/utilisateurs" element={<ProtectedRoute requiredRole="admin"><AdminUtilisateurs /></ProtectedRoute>} />
        <Route path="/admin/demandes"     element={<ProtectedRoute requiredRole="admin"><AdminDemandes /></ProtectedRoute>} />
        <Route path="/admin/commandes"    element={<ProtectedRoute requiredRole="admin"><AdminCommandes /></ProtectedRoute>} />

      </Routes>
    </HashRouter>
  );
}

export default App;