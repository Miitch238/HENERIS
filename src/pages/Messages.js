import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import ClientLayout from '../components/ClientLayout';
import './Messages.css';

const MOCK_CONVERSATIONS = [
  { id: 1, shopper: { nom: 'Sophie Marchand', specialite: 'Maroquinerie' }, dernierMessage: 'J\'ai trouvé une Birkin noire en excellent état.', heure: '10:32', nonLus: 2 },
  { id: 2, shopper: { nom: 'Marc Laurent', specialite: 'Montres' }, dernierMessage: 'La Datejust est disponible jusqu\'à vendredi.', heure: 'Hier', nonLus: 0 },
  { id: 3, shopper: { nom: 'Élise Dumont', specialite: 'Bijoux' }, dernierMessage: 'Parfait, je reviens vers vous demain.', heure: 'Lun.', nonLus: 0 },
];

const MOCK_MESSAGES = {
  1: [
    { id: 1, sender: 'shopper', contenu: 'Bonjour, j\'ai bien reçu votre demande pour une Hermès Birkin 30.', heure: '10:15' },
    { id: 2, sender: 'client', contenu: 'Bonjour Sophie ! Oui, je cherche idéalement du cuir togo noir avec hardware doré.', heure: '10:18' },
    { id: 3, sender: 'shopper', contenu: 'Je connais justement une pièce qui correspond parfaitement à vos critères. Elle est en très bon état et livrée avec boîte et papiers.', heure: '10:25' },
    { id: 4, sender: 'shopper', contenu: 'J\'ai trouvé une Birkin noire en excellent état.', heure: '10:32' },
  ],
  2: [
    { id: 1, sender: 'shopper', contenu: 'Bonjour, j\'ai une Datejust 36mm cadran blanc disponible.', heure: 'Hier 14:10' },
    { id: 2, sender: 'client', contenu: 'Super, elle a les papiers ?', heure: 'Hier 14:35' },
    { id: 3, sender: 'shopper', contenu: 'La Datejust est disponible jusqu\'à vendredi.', heure: 'Hier 15:02' },
  ],
  3: [
    { id: 1, sender: 'client', contenu: 'Bonjour, est-ce que le bracelet Love est encore disponible ?', heure: 'Lun. 09:00' },
    { id: 2, sender: 'shopper', contenu: 'Oui, il est en taille 17 or jaune. Je peux vous envoyer des photos supplémentaires.', heure: 'Lun. 09:45' },
    { id: 3, sender: 'client', contenu: 'Oui avec plaisir !', heure: 'Lun. 10:00' },
    { id: 4, sender: 'shopper', contenu: 'Parfait, je reviens vers vous demain.', heure: 'Lun. 10:12' },
  ],
};

export default function Messages() {
  const [user, setUser] = useState(null);
  const [activeConv, setActiveConv] = useState(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES[1]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const selectConv = conv => {
    setActiveConv(conv);
    setMessages(MOCK_MESSAGES[conv.id] || []);
  };

  const sendMessage = e => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = { id: Date.now(), sender: 'client', contenu: input.trim(), heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, msg]);
    setInput('');
    // TODO: supabase insert into messages
  };

  return (
    <ClientLayout user={user}>
      <div className="msg-page">

        {/* ── Sidebar conversations ── */}
        <aside className="msg-sidebar">
          <div className="msg-sidebar-header">
            <h2 className="msg-sidebar-title">Messages</h2>
          </div>
          <div className="msg-conv-list">
            {MOCK_CONVERSATIONS.map(conv => (
              <button
                key={conv.id}
                className={`msg-conv-item ${activeConv.id === conv.id ? 'active' : ''}`}
                onClick={() => selectConv(conv)}
              >
                <div className="msg-conv-avatar">
                  {conv.shopper.nom.charAt(0)}
                </div>
                <div className="msg-conv-info">
                  <div className="msg-conv-top">
                    <span className="msg-conv-name">{conv.shopper.nom}</span>
                    <span className="msg-conv-time">{conv.heure}</span>
                  </div>
                  <div className="msg-conv-bottom">
                    <span className="msg-conv-last">{conv.dernierMessage}</span>
                    {conv.nonLus > 0 && <span className="msg-unread-badge">{conv.nonLus}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Chat ── */}
        <div className="msg-chat">
          {/* Header */}
          <div className="msg-chat-header">
            <div className="msg-chat-avatar">{activeConv.shopper.nom.charAt(0)}</div>
            <div>
              <p className="msg-chat-name">{activeConv.shopper.nom}</p>
              <p className="msg-chat-spec">{activeConv.shopper.specialite}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="msg-body">
            {messages.map(m => (
              <div key={m.id} className={`msg-bubble-wrap ${m.sender === 'client' ? 'msg-mine' : 'msg-theirs'}`}>
                <div className="msg-bubble">
                  <p>{m.contenu}</p>
                  <span className="msg-time">{m.heure}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form className="msg-input-bar" onSubmit={sendMessage}>
            <input
              type="text"
              className="msg-input"
              placeholder="Écrire un message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="msg-send-btn" disabled={!input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>

      </div>
    </ClientLayout>
  );
}
