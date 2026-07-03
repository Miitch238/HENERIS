import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ClientLayout from '../components/ClientLayout';
import '../styles/auth.css';
import './DeposerDemande.css';

const CATEGORIES = ['Maroquinerie', 'Montres', 'Bijoux', 'Vêtements', 'Art de vivre', 'Autre'];
const DELAIS = ['Moins d\'une semaine', '1 à 2 semaines', '2 à 4 semaines', '1 à 2 mois', 'Pas de délai précis'];

export default function DeposerDemande() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    categorie: '',
    description: '',
    budget_min: '',
    budget_max: '',
    delai: '',
  });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotos = e => {
    const files = Array.from(e.target.files).slice(0, 5);
    setPhotos(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removePhoto = idx => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (Number(form.budget_min) >= Number(form.budget_max)) {
      setError('Le budget minimum doit être inférieur au budget maximum.');
      return;
    }

    setLoading(true);
    // TODO: upload photos to Supabase Storage, then insert demande
    const { error } = await supabase.from('demandes').insert({
      client_id: user.id,
      categorie: form.categorie,
      description: form.description,
      budget_min: Number(form.budget_min),
      budget_max: Number(form.budget_max),
      delai: form.delai,
      statut: 'en_attente',
    });
    setLoading(false);

    if (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/client/home'), 2500);
    }
  };

  return (
    <ClientLayout user={user}>
      <div className="dd-page">
        <div className="dd-card">
          <div className="dd-header">
            <p className="dd-eyebrow">Nouvelle demande</p>
            <h1 className="dd-title">Déposer une demande</h1>
            <p className="dd-subtitle">Décrivez la pièce que vous recherchez. Nos shoppers vous feront leurs propositions.</p>
          </div>

          {success ? (
            <div className="form-success" style={{ fontSize: '0.9rem' }}>
              Votre demande a été déposée avec succès.<br />
              Nos shoppers vont l'étudier et vous contacter prochainement.
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>

              <div className="form-field">
                <label className="form-label" htmlFor="categorie">Catégorie</label>
                <select
                  id="categorie"
                  name="categorie"
                  className="form-input form-select"
                  value={form.categorie}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Choisir une catégorie…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="description">Description détaillée</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input dd-textarea"
                  placeholder="Décrivez précisément la pièce : modèle, couleur, matière, références, état souhaité, occasion…"
                  value={form.description}
                  onChange={handleChange}
                  required
                  minLength={30}
                />
                <span className="form-hint">{form.description.length} / 30 caractères minimum</span>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label" htmlFor="budget_min">Budget minimum (€)</label>
                  <input
                    id="budget_min"
                    name="budget_min"
                    type="number"
                    min={0}
                    step={100}
                    className="form-input"
                    placeholder="500"
                    value={form.budget_min}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="budget_max">Budget maximum (€)</label>
                  <input
                    id="budget_max"
                    name="budget_max"
                    type="number"
                    min={0}
                    step={100}
                    className="form-input"
                    placeholder="2 000"
                    value={form.budget_max}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <span className="form-hint" style={{ marginTop: -12 }}>
              Protection acheteur : 5% au-dessus de 1 000 €, 10% en dessous.
              </span>

              <div className="form-field">
                <label className="form-label" htmlFor="delai">Délai souhaité</label>
                <select
                  id="delai"
                  name="delai"
                  className="form-input form-select"
                  value={form.delai}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Choisir un délai…</option>
                  {DELAIS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Photos */}
              <div className="form-field">
                <label className="form-label">Photos de référence (optionnel, max 5)</label>
                <label className="dd-upload-zone">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotos}
                    style={{ display: 'none' }}
                  />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>Cliquez pour ajouter des images</span>
                </label>
                {previews.length > 0 && (
                  <div className="dd-previews">
                    {previews.map((src, i) => (
                      <div key={i} className="dd-preview-item">
                        <img src={src} alt={`Référence ${i + 1}`} />
                        <button type="button" className="dd-preview-remove" onClick={() => removePhoto(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Envoi en cours…' : 'Soumettre ma demande'}
              </button>
            </form>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
