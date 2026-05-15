import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ClientLayout from '../components/ClientLayout';
import './Profil.css';

export default function Profil() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ prenom: '', nom: '', email: '' });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('prenom, nom, email, role')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setForm({ prenom: data.prenom, nom: data.nom, email: data.email });
      } else {
        // Fallback sur user_metadata
        const meta = user.user_metadata || {};
        const fallback = {
          prenom: meta.first_name || '',
          nom:    meta.last_name  || '',
          email:  user.email      || '',
          role:   meta.role       || 'client',
        };
        setProfile(fallback);
        setForm({ prenom: fallback.prenom, nom: fallback.nom, email: fallback.email });
      }
    };
    load();
  }, []);

  const initials = `${form.prenom.charAt(0)}${form.nom.charAt(0)}`.toUpperCase() || '?';
  const fullName = `${form.prenom} ${form.nom}`.trim() || 'Utilisateur';

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const { error: profileErr } = await supabase
      .from('profiles')
      .update({ prenom: form.prenom, nom: form.nom })
      .eq('user_id', user.id);

    if (profileErr) {
      setError('Impossible de sauvegarder. Réessayez.');
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
    setEditing(false);
    setProfile(p => ({ ...p, prenom: form.prenom, nom: form.nom }));
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <ClientLayout user={user}>
      <div className="pf-page">
        <div className="pf-card">

          {/* ── Avatar ── */}
          <div className="pf-avatar-wrap">
            <div className="pf-avatar">{initials}</div>
            {profile?.role && (
              <span className="pf-role-badge">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
            )}
          </div>

          {/* ── Nom ── */}
          {!editing && (
            <div className="pf-identity">
              <h1 className="pf-name">{fullName}</h1>
              <p className="pf-email">{form.email}</p>
            </div>
          )}

          {/* ── Formulaire modification ── */}
          {editing ? (
            <form className="pf-form" onSubmit={handleSave}>
              <div className="pf-form-row">
                <div className="pf-field">
                  <label className="pf-label" htmlFor="prenom">Prénom</label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    className="pf-input"
                    value={form.prenom}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="pf-field">
                  <label className="pf-label" htmlFor="nom">Nom</label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    className="pf-input"
                    value={form.nom}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="pf-field">
                <label className="pf-label" htmlFor="email">Adresse e-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="pf-input pf-input--disabled"
                  value={form.email}
                  disabled
                />
                <span className="pf-hint">L'e-mail ne peut pas être modifié ici.</span>
              </div>

              {error && <p className="pf-error">{error}</p>}

              <div className="pf-form-actions">
                <button type="submit" className="pf-btn-save" disabled={saving}>
                  {saving ? 'Sauvegarde…' : 'Enregistrer'}
                </button>
                <button type="button" className="pf-btn-cancel" onClick={() => { setEditing(false); setError(''); }}>
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="pf-actions">
              {saved && (
                <div className="pf-saved-msg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Modifications enregistrées
                </div>
              )}

              <button className="pf-btn-edit" onClick={() => setEditing(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Modifier mes informations
              </button>

              <div className="pf-divider" />

              <div className="pf-info-list">
                <div className="pf-info-row">
                  <span className="pf-info-label">Prénom</span>
                  <span className="pf-info-value">{form.prenom || '—'}</span>
                </div>
                <div className="pf-info-row">
                  <span className="pf-info-label">Nom</span>
                  <span className="pf-info-value">{form.nom || '—'}</span>
                </div>
                <div className="pf-info-row">
                  <span className="pf-info-label">E-mail</span>
                  <span className="pf-info-value">{form.email || '—'}</span>
                </div>
                <div className="pf-info-row">
                  <span className="pf-info-label">Rôle</span>
                  <span className="pf-info-value pf-info-role">{profile?.role || '—'}</span>
                </div>
              </div>

              <div className="pf-divider" />

              <button className="pf-btn-logout" onClick={handleLogout}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Se déconnecter
              </button>
            </div>
          )}

        </div>
      </div>
    </ClientLayout>
  );
}
