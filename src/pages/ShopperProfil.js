import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';
import './Profil.css';
import './ShopperProfil.css';

const SPECIALITES = ['Haute Couture', 'Prêt-à-porter luxe', 'Accessoires & Maroquinerie', 'Joaillerie & Montres', 'Mode homme', 'Mode femme', 'Streetwear & Sneakers', 'Vintage & Archives'];

export default function ShopperProfil() {
  const navigate = useNavigate();
  const [user, setUser]     = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm]     = useState({ prenom: '', nom: '', email: '', specialite: '', city: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) return;
      const { data } = await supabase.from('profiles').select('prenom, nom, email, role').eq('user_id', user.id).single();
      const meta = user.user_metadata || {};
      setForm({
        prenom:     data?.prenom     || meta.first_name  || '',
        nom:        data?.nom        || meta.last_name   || '',
        email:      data?.email      || user.email       || '',
        specialite: meta.specialite  || '',
        city:       meta.city        || '',
        bio:        meta.bio         || '',
      });
    };
    load();
  }, []);

  const initials = `${form.prenom.charAt(0)}${form.nom.charAt(0)}`.toUpperCase() || '?';
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('profiles').update({ prenom: form.prenom, nom: form.nom }).eq('user_id', user.id);
    setSaving(false); setSaved(true); setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  return (
    <ShopperLayout user={user}>
      <div className="pf-page">
        <div className="pf-card" style={{ maxWidth: 520 }}>
          <div className="pf-avatar-wrap">
            <div className="pf-avatar" style={{ background: '#1a1a1a', color: '#C9A84C' }}>{initials}</div>
            <span className="pf-role-badge" style={{ color: '#1a1a1a', background: 'rgba(26,26,26,0.07)', borderColor: 'rgba(26,26,26,0.15)' }}>Shopper</span>
          </div>

          {!editing && (
            <div className="pf-identity">
              <h1 className="pf-name">{`${form.prenom} ${form.nom}`.trim() || 'Shopper'}</h1>
              <p className="pf-email">{form.email}</p>
              {form.specialite && <p className="sp-specialite">{form.specialite} · {form.city}</p>}
            </div>
          )}

          {editing ? (
            <form className="pf-form" onSubmit={handleSave}>
              <div className="pf-form-row">
                <div className="pf-field"><label className="pf-label">Prénom</label><input name="prenom" className="pf-input" value={form.prenom} onChange={handleChange} required /></div>
                <div className="pf-field"><label className="pf-label">Nom</label><input name="nom" className="pf-input" value={form.nom} onChange={handleChange} required /></div>
              </div>
              <div className="pf-form-row">
                <div className="pf-field">
                  <label className="pf-label">Spécialité</label>
                  <select name="specialite" className="pf-input" value={form.specialite} onChange={handleChange}>
                    <option value="">—</option>
                    {SPECIALITES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="pf-field"><label className="pf-label">Ville</label><input name="city" className="pf-input" value={form.city} onChange={handleChange} placeholder="Paris" /></div>
              </div>
              <div className="pf-field">
                <label className="pf-label">Bio</label>
                <textarea name="bio" className="pf-input sp-textarea" rows={3} value={form.bio} onChange={handleChange} placeholder="Présentez votre expertise…" />
              </div>
              {error && <p className="pf-error">{error}</p>}
              <div className="pf-form-actions">
                <button type="submit" className="pf-btn-save" disabled={saving}>{saving ? 'Sauvegarde…' : 'Enregistrer'}</button>
                <button type="button" className="pf-btn-cancel" onClick={() => setEditing(false)}>Annuler</button>
              </div>
            </form>
          ) : (
            <div className="pf-actions">
              {saved && <div className="pf-saved-msg"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Modifications enregistrées</div>}
              <button className="pf-btn-edit" style={{ borderColor: '#1a1a1a' }} onClick={() => setEditing(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Modifier mes informations
              </button>
              <div className="pf-divider" />
              <div className="pf-info-list">
                {[['Prénom', form.prenom], ['Nom', form.nom], ['E-mail', form.email], ['Spécialité', form.specialite], ['Ville', form.city]].map(([l, v]) => (
                  <div className="pf-info-row" key={l}>
                    <span className="pf-info-label">{l}</span>
                    <span className="pf-info-value">{v || '—'}</span>
                  </div>
                ))}
                {form.bio && <div className="pf-info-row"><span className="pf-info-label">Bio</span><span className="pf-info-value sp-bio">{form.bio}</span></div>}
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
    </ShopperLayout>
  );
}
