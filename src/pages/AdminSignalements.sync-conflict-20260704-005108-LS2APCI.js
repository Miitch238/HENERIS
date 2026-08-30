import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AdminLayout from '../components/AdminLayout';
import '../styles/admin.css';

const MOCK = [
  { id: 'SIG-001', signale: 'Pierre V.',    typeCompte: 'Shopper', motif: 'Sac Dior présenté comme authentique, coutures et logo suspects.',          signalePar: 'Marie Dupont',      statut: 'ouvert',   date: '2026-05-13' },
  { id: 'SIG-002', signale: 'Compte #84',   typeCompte: 'Client',  motif: 'Messages à caractère harcelant répétés dans la messagerie intégrée.',       signalePar: 'Sophie M.',         statut: 'en cours',  date: '2026-05-10' },
  { id: 'SIG-003', signale: 'Shopper #48',  typeCompte: 'Shopper', motif: "Documents d'identité Stripe potentiellement falsifiés.",                    signalePar: 'Admin système',     statut: 'résolu',    date: '2026-04-22' },
  { id: 'SIG-004', signale: 'Marc L.',      typeCompte: 'Shopper', motif: 'Demande de paiement hors plateforme par virement bancaire direct.',         signalePar: 'Thomas Bernard',    statut: 'ouvert',   date: '2026-05-14' },
  { id: 'SIG-005', signale: 'Camille R.',   typeCompte: 'Shopper', motif: "Photos d'articles non conformes aux standards de la plateforme.",           signalePar: 'Isabelle Martin',   statut: 'résolu',    date: '2026-05-02' },
  { id: 'SIG-006', signale: 'Utilisateur #112', typeCompte: 'Client', motif: 'Tentative de redirection vers un site tiers via la messagerie.',         signalePar: 'Aline Rousseau',    statut: 'en cours',  date: '2026-05-11' },
];

const ST = { ouvert: 'ap-badge--red', 'en cours': 'ap-badge--yellow', résolu: 'ap-badge--green' };
const COLS = '80px minmax(120px,1fr) 90px minmax(180px,2fr) minmax(120px,1fr) 90px 80px 100px';

export default function AdminSignalements() {
  const [user, setUser]     = useState(null);
  const [filter, setFilter] = useState('tous');

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const sigs = filter === 'tous' ? MOCK : MOCK.filter(s => s.statut === filter);

  return (
    <AdminLayout user={user}>
      <div className="ap-page">
        <div className="ap-header">
          <div><p className="ap-eyebrow">Administration</p><h1 className="ap-title">Signalements</h1></div>
        </div>

        <div className="ap-stats">
          {[
            { v: MOCK.length,                                          l: 'Total' },
            { v: MOCK.filter(s => s.statut === 'ouvert').length,       l: 'Ouverts' },
            { v: MOCK.filter(s => s.statut === 'en cours').length,     l: 'En cours' },
            { v: MOCK.filter(s => s.statut === 'résolu').length,       l: 'Résolus' },
          ].map(s => (
            <div className="ap-stat" key={s.l}>
              <p className="ap-stat-value">{s.v}</p>
              <p className="ap-stat-label">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="ap-filters">
          {['tous', 'ouvert', 'en cours', 'résolu'].map(f => (
            <button
              key={f}
              className="ap-action-btn"
              style={{ padding: '6px 14px', border: '1px solid', borderColor: filter === f ? '#C9A84C' : '#e0e0e0', borderRadius: 99, fontSize: '0.78rem', color: filter === f ? '#C9A84C' : '#888', background: filter === f ? 'rgba(201,168,76,0.06)' : 'none' }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="ap-table">
          <div className="ap-table-head" style={{ gridTemplateColumns: COLS }}>
            <span>ID</span>
            <span>Utilisateur signalé</span>
            <span>Type compte</span>
            <span>Motif</span>
            <span>Signalé par</span>
            <span>Statut</span>
            <span>Date</span>
            <span>Action</span>
          </div>
          {sigs.map(s => (
            <div className="ap-table-row" style={{ gridTemplateColumns: COLS }} key={s.id}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#aaa' }}>{s.id}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a' }}>{s.signale}</span>
              <span>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em',
                  padding: '3px 9px', borderRadius: 99,
                  background: s.typeCompte === 'Shopper' ? 'rgba(201,168,76,0.12)' : 'rgba(37,99,235,0.1)',
                  color: s.typeCompte === 'Shopper' ? '#C9A84C' : '#2563EB',
                  whiteSpace: 'nowrap',
                }}>
                  {s.typeCompte}
                </span>
              </span>
              <span style={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.4 }}>{s.motif}</span>
              <span style={{ fontSize: '0.82rem', color: '#555' }}>{s.signalePar}</span>
              <span><span className={`ap-badge ${ST[s.statut]}`}>{s.statut}</span></span>
              <span style={{ fontSize: '0.75rem', color: '#bbb' }}>
                {new Date(s.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
              </span>
              <span>
                <button
                  className="ap-action-btn"
                  style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: 6, border: '1px solid #C9A84C', color: '#C9A84C', background: 'rgba(201,168,76,0.06)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onClick={() => alert(`Examen du signalement ${s.id}`)}
                >
                  Examiner
                </button>
              </span>
            </div>
          ))}
          {sigs.length === 0 && <div className="ap-empty">Aucun signalement pour ce filtre.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
