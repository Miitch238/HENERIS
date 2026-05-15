import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';
import '../pages/Messages.css';

const MOCK_CONV = [
  { id: 1, client: { nom: 'Marie D.' }, dernierMessage: 'Super, j\'attends votre confirmation.', heure: '11:05', nonLus: 1 },
  { id: 2, client: { nom: 'Alexandre S.' }, dernierMessage: 'Avez-vous la boîte d\'origine ?', heure: 'Hier', nonLus: 0 },
  { id: 3, client: { nom: 'Isabelle M.' }, dernierMessage: 'Parfait, merci beaucoup !', heure: 'Lun.', nonLus: 0 },
];
const MOCK_MSG = {
  1: [
    { id: 1, sender: 'client',  contenu: 'Bonjour, j\'ai vu votre proposition pour la Birkin.', heure: '10:40' },
    { id: 2, sender: 'shopper', contenu: 'Bonjour Marie, oui la pièce est disponible avec boîte et papiers complets.', heure: '10:50' },
    { id: 3, sender: 'client',  contenu: 'Super, j\'attends votre confirmation.', heure: '11:05' },
  ],
  2: [
    { id: 1, sender: 'shopper', contenu: 'Bonjour Alexandre, la Datejust est en excellent état.', heure: 'Hier 09:00' },
    { id: 2, sender: 'client',  contenu: 'Avez-vous la boîte d\'origine ?', heure: 'Hier 09:30' },
  ],
  3: [
    { id: 1, sender: 'client',  contenu: 'La livraison est prévue pour quand ?', heure: 'Lun. 14:00' },
    { id: 2, sender: 'shopper', contenu: 'Sous 48h ouvrées.', heure: 'Lun. 14:20' },
    { id: 3, sender: 'client',  contenu: 'Parfait, merci beaucoup !', heure: 'Lun. 14:22' },
  ],
};

export default function ShopperMessages() {
  const [user, setUser]       = useState(null);
  const [activeConv, setActive] = useState(MOCK_CONV[0]);
  const [messages, setMessages] = useState(MOCK_MSG[1]);
  const [input, setInput]     = useState('');
  const bottomRef             = useRef(null);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const selectConv = c => { setActive(c); setMessages(MOCK_MSG[c.id] || []); };

  const send = e => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(p => [...p, { id: Date.now(), sender: 'shopper', contenu: input.trim(), heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <ShopperLayout user={user}>
      <div className="msg-page">
        <aside className="msg-sidebar">
          <div className="msg-sidebar-header"><h2 className="msg-sidebar-title">Messages</h2></div>
          <div className="msg-conv-list">
            {MOCK_CONV.map(c => (
              <button key={c.id} className={`msg-conv-item ${activeConv.id === c.id ? 'active' : ''}`} onClick={() => selectConv(c)}>
                <div className="msg-conv-avatar" style={{ background: '#1a1a1a', color: '#C9A84C' }}>{c.client.nom.charAt(0)}</div>
                <div className="msg-conv-info">
                  <div className="msg-conv-top">
                    <span className="msg-conv-name">{c.client.nom}</span>
                    <span className="msg-conv-time">{c.heure}</span>
                  </div>
                  <div className="msg-conv-bottom">
                    <span className="msg-conv-last">{c.dernierMessage}</span>
                    {c.nonLus > 0 && <span className="msg-unread-badge">{c.nonLus}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>
        <div className="msg-chat">
          <div className="msg-chat-header">
            <div className="msg-chat-avatar" style={{ background: '#1a1a1a', color: '#C9A84C' }}>{activeConv.client.nom.charAt(0)}</div>
            <div>
              <p className="msg-chat-name">{activeConv.client.nom}</p>
              <p className="msg-chat-spec">Client</p>
            </div>
          </div>
          <div className="msg-body">
            {messages.map(m => (
              <div key={m.id} className={`msg-bubble-wrap ${m.sender === 'shopper' ? 'msg-mine' : 'msg-theirs'}`}>
                <div className="msg-bubble">
                  <p>{m.contenu}</p>
                  <span className="msg-time">{m.heure}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form className="msg-input-bar" onSubmit={send}>
            <input type="text" className="msg-input" placeholder="Écrire un message…" value={input} onChange={e => setInput(e.target.value)} autoComplete="off" />
            <button type="submit" className="msg-send-btn" style={{ background: '#1a1a1a', color: '#C9A84C' }} disabled={!input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      </div>
    </ShopperLayout>
  );
}
