import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AdminLayout from '../components/AdminLayout';
import '../styles/admin.css';
import './AdminParametres.css';

export default function AdminParametres() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ commission: '10', devise: 'EUR', maintenance: false, inscription_shopper: true, email_support: 'support@heneris.com', stripe_mode: 'live' });
  const [saved, setSaved] = useState(false);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSave = e => {
    e.preventDefault();
    // TODO: persist dans Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout user={user}>
      <div className="ap-page">
        <div className="ap-header">
          <div><p className="ap-eyebrow">Administration</p><h1 className="ap-title">Paramètres</h1></div>
          <button className="ap-cta" onClick={handleSave}>Enregistrer</button>
        </div>

        {saved && <div className="prm-saved">✓ Paramètres enregistrés avec succès.</div>}

        <form onSubmit={handleSave}>
          <div className="prm-sections">

            <div className="prm-section">
              <h2 className="prm-section-title">Paiements & Commission</h2>
              <div className="prm-grid">
                <div className="prm-field">
                  <label className="prm-label">Commission Hénéris (%)</label>
                  <input name="commission" type="number" min={0} max={50} className="prm-input" value={form.commission} onChange={handleChange} />
                  <p className="prm-hint">Prélevée sur chaque transaction. Actuellement : {form.commission}% au client, 90% reversé au shopper.</p>
                </div>
                <div className="prm-field">
                  <label className="prm-label">Devise</label>
                  <select name="devise" className="prm-input prm-select" value={form.devise} onChange={handleChange}>
                    <option value="EUR">EUR — Euro</option>
                    <option value="USD">USD — Dollar</option>
                    <option value="GBP">GBP — Livre sterling</option>
                  </select>
                </div>
                <div className="prm-field">
                  <label className="prm-label">Mode Stripe</label>
                  <select name="stripe_mode" className="prm-input prm-select" value={form.stripe_mode} onChange={handleChange}>
                    <option value="live">Live (production)</option>
                    <option value="test">Test</option>
                  </select>
                  {form.stripe_mode === 'test' && <p className="prm-hint prm-hint--warn">⚠ Mode test actif — les paiements ne sont pas réels.</p>}
                </div>
              </div>
            </div>

            <div className="prm-section">
              <h2 className="prm-section-title">Plateforme</h2>
              <div className="prm-grid">
                <div className="prm-field">
                  <label className="prm-label">Email support</label>
                  <input name="email_support" type="email" className="prm-input" value={form.email_support} onChange={handleChange} />
                </div>
              </div>
              <div className="prm-toggles">
                <label className="prm-toggle">
                  <input type="checkbox" name="inscription_shopper" checked={form.inscription_shopper} onChange={handleChange} />
                  <span className="prm-toggle-track"><span className="prm-toggle-thumb" /></span>
                  <span className="prm-toggle-label">Inscriptions shopper ouvertes</span>
                </label>
                <label className="prm-toggle">
                  <input type="checkbox" name="maintenance" checked={form.maintenance} onChange={handleChange} />
                  <span className="prm-toggle-track" style={form.maintenance ? { background: '#e53935' } : {}}><span className="prm-toggle-thumb" /></span>
                  <span className="prm-toggle-label">Mode maintenance {form.maintenance && <span style={{ color: '#e53935', fontWeight: 600 }}>— plateforme inaccessible au public</span>}</span>
                </label>
              </div>
            </div>

          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
