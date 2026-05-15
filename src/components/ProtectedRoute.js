import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ROLE_ROUTES = {
  client:  '/client/home',
  shopper: '/shopper/home',
  admin:   '/admin/dashboard',
};

export default function ProtectedRoute({ children, requiredRole }) {
  const [status, setStatus]     = useState('loading');
  const [redirectTo, setRedirectTo] = useState('/login');

  useEffect(() => {
    const check = async () => {
      // 1. Vérifier la session active
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('[ProtectedRoute] Erreur getSession :', sessionError.message);
        setStatus('unauthorized');
        return;
      }

      if (!session) {
        console.warn('[ProtectedRoute] Aucune session — redirection /login');
        setStatus('unauthorized');
        return;
      }

      console.log('[ProtectedRoute] Session OK — user.id :', session.user.id);

      // Pas de rôle requis → accès libre si connecté
      if (!requiredRole) {
        setStatus('authorized');
        return;
      }

      // Bypass admin immédiat via user_metadata (avant toute requête DB)
      const metaRole = session.user.user_metadata?.role;
      if (metaRole === 'admin') {
        console.log('[ProtectedRoute] Admin détecté via user_metadata — accès total');
        setStatus('authorized');
        return;
      }

      // 2. Lire le profil via user_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (profileError) {
        console.error('[ProtectedRoute] Erreur lecture profiles :', profileError.message);
        if (metaRole === requiredRole) {
          setStatus('authorized');
        } else {
          setRedirectTo(ROLE_ROUTES[metaRole] || '/login');
          setStatus('unauthorized');
        }
        return;
      }

      console.log('[ProtectedRoute] Profil trouvé — role :', profile?.role, '| requis :', requiredRole);

      // Admin via table profiles — accès total
      if (profile?.role === 'admin') {
        setStatus('authorized');
        return;
      }

      if (profile?.role === requiredRole) {
        setStatus('authorized');
      } else {
        console.warn('[ProtectedRoute] Mauvais rôle → redirect vers', ROLE_ROUTES[profile?.role] || '/login');
        setRedirectTo(ROLE_ROUTES[profile?.role] || '/login');
        setStatus('unauthorized');
      }
    };

    check();
  }, [requiredRole]);

  if (status === 'loading') return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
    }}>
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.5rem',
        color: '#C9A84C',
        letterSpacing: '0.06em',
      }}>
        Heneris
      </span>
    </div>
  );

  if (status === 'unauthorized') return <Navigate to={redirectTo} replace />;
  return children;
}
