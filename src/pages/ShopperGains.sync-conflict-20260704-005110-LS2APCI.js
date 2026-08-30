import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout, { palette } from '../components/ShopperLayout';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Montserrat', sans-serif";
const { cardBg, ink, inkSoft, hairline, gold } = palette;

/* Schéma Supabase réel (vérifié) :
   demandes : id, description, statut ('terminee'), categorie, created_at
   Pas de colonnes titre/montant_final/updated_at/date_versement actuellement —
   les montants resteront à 0 tant que Mitch n'aura pas ajouté le suivi
   financier (montant final accepté + date de virement) côté base. */

const KpiCard = ({ label, value, suffix, accent }) => (
  <div style={{ background: cardBg, border: `1px solid ${hairline}`, borderTop: accent ? `2px solid ${gold}` : `1px solid ${hairline}`, padding: '26px 24px', flex: 1, minWidth: '200px' }}>
    <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: inkSoft, marginBottom: '14px' }}>{label}</p>
    <p style={{ fontFamily: serif, fontSize: '2.1rem', fontWeight: 300, fontStyle: 'italic', color: accent ? gold : ink, lineHeight: 1 }}>
      {value}{suffix && <span style={{ fontFamily: sans, fontSize: '.85rem', fontStyle: 'normal', color: inkSoft, marginLeft: '5px' }}>{suffix}</span>}
    </p>
  </div>
);

const nextPayoutDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + (now.getDate() >= 5 ? 1 : 0), 5);
};

export default function ShopperGains() {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      try {
        const { data, error } = await supabase
          .from('demandes')
          .select('*')
          .eq('shopper_id', session.user.id)
          .eq('statut', 'terminee')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setMissions(data || []);
      } catch (err) {
        console.error('Erreur chargement des gains :', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const now = new Date();
  const revenusMois = missions.filter(m => {
    const dt = m.created_at ? new Date(m.created_at) : null;
    return dt && dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
  }).reduce((s, m) => s + (Number(m.montant_final) || 0), 0);

  const revenusTotal = missions.reduce((s, m) => s + (Number(m.montant_final) || 0), 0);
  const enAttente = missions.filter(m => !m.date_versement).reduce((s, m) => s + (Number(m.montant_final) || 0), 0);

  return (
    <ShopperLayout fullWidth>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: serif, fontSize: '2.2rem', fontWeight: 300, fontStyle: 'italic', color: ink, marginBottom: '8px' }}>Mes gains</h1>
        <p style={{ fontFamily: sans, fontSize: '13px', color: inkSoft }}>Revenus, historique de paiements et prochain virement.</p>
        <div style={{ width: '36px', height: '1px', background: gold, margin: '20px 0 28px' }} />

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <KpiCard label="Revenus ce mois" value={loading ? '—' : revenusMois.toLocaleString('fr-FR')} suffix="€" accent />
          <KpiCard label="Revenus cumulés" value={loading ? '—' : revenusTotal.toLocaleString('fr-FR')} suffix="€" />
          <KpiCard label="En attente de virement" value={loading ? '—' : enAttente.toLocaleString('fr-FR')} suffix="€" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '36px' }}>
          <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '24px 26px' }}>
            <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.18em', textTransform: 'uppercase', color: inkSoft, marginBottom: '10px' }}>Prochain virement</p>
            <p style={{ fontFamily: serif, fontSize: '1.4rem', fontStyle: 'italic', color: ink }}>
              {nextPayoutDate().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p style={{ fontFamily: sans, fontSize: '11px', color: inkSoft, marginTop: '6px' }}>
              Estimation : {enAttente.toLocaleString('fr-FR')} € sur vos missions terminées non encore versées.
            </p>
          </div>
          <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '24px 26px' }}>
            <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.18em', textTransform: 'uppercase', color: inkSoft, marginBottom: '10px' }}>Commission</p>
            <p style={{ fontFamily: serif, fontSize: '1.4rem', fontStyle: 'italic', color: gold }}>Vous conservez 100%</p>
            <p style={{ fontFamily: sans, fontSize: '11px', color: inkSoft, marginTop: '6px' }}>
              Heneris prélève 10% côté client au moment de la commande. Ce montant n'est jamais déduit de vos gains.
            </p>
          </div>
        </div>

        <div>
          <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', color: inkSoft, marginBottom: '14px' }}>Historique</p>
          {loading ? (
            <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Chargement…</p>
          ) : missions.length === 0 ? (
            <div style={{ background: cardBg, border: `1px solid ${hairline}`, padding: '40px', textAlign: 'center' }}>
              <p style={{ fontFamily: serif, fontStyle: 'italic', color: inkSoft }}>Aucune mission terminée pour le moment.</p>
            </div>
          ) : (
            <div style={{ background: cardBg, border: `1px solid ${hairline}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 120px 130px', padding: '14px 24px', borderBottom: `1px solid ${hairline}`, fontFamily: sans, fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: inkSoft }}>
                <span>Mission</span><span>Date</span><span>Montant</span><span>Statut</span>
              </div>
              {missions.map(m => (
                <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 120px 130px', padding: '16px 24px', borderBottom: `1px solid ${hairline}`, alignItems: 'center' }}>
                  <span style={{ fontFamily: serif, fontSize: '1rem', color: ink }}>{m.description ? m.description.slice(0, 40) : 'Mission'}</span>
                  <span style={{ fontFamily: sans, fontSize: '11px', color: inkSoft }}>{m.created_at ? new Date(m.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—'}</span>
                  <span style={{ fontFamily: sans, fontSize: '12px', fontWeight: 500, color: ink }}>{m.montant_final ? `${m.montant_final} €` : '—'}</span>
                  <span style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '.08em', textTransform: 'uppercase', color: m.date_versement ? '#3E7A56' : '#B58A2E' }}>{m.date_versement ? 'Versé' : 'En attente'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ShopperLayout>
  );
}