import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import ShopperLayout from '../components/ShopperLayout';
import '../pages/Messages.css';

export default function ShopperMessages() {
  const [user, setUser]             = useState(null);
  const [conversations, setConvs]   = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(true);
  const bottomRef                   = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user;
      setUser(u);
      if (!u) return;
      await chargerConversations(u.id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!activeConv) return;
    const channel = supabase
      .channel(`shopper-messages-${activeConv.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${activeConv.id}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [activeConv]);

  async function chargerConversations(userId) {
    const { data } = await supabase
      .from('conversations')
      .select(`*, client:client_id ( id, email ), client_profile:client_id ( prenom, nom ), messages ( contenu, created_at )`)
      .eq('shopper_id', userId)
      .order('created_at', { ascending: false });

    setConvs(data || []);
    if (data?.length > 0) {
      setActiveConv(data[0]);
      await chargerMessages(data[0].id);
    }
  }

  async function chargerMessages(convId) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    setMessages(data || []);

    await supabase
      .from('messages')
      .update({ lu: true })
      .eq('conversation_id', convId)
      .eq('lu', false);
  }

  async function selectConv(conv) {
    setActiveConv(conv);
    await chargerMessages(conv.id);
  }

  async function send(e) {
    e.preventDefault();
    if (!input.trim() || !user || !activeConv) return;
    const contenu = input.trim();
    setInput('');
    await supabase.from('messages').insert({
      conversation_id: activeConv.id,
      sender_id: user.id,
      contenu,
    });
  }

  const getNom = (conv) => {
    const prenom = conv.client_profile?.prenom;
    const nom = conv.client_profile?.nom;
    if (prenom) return `${prenom} ${nom || ''}`.trim();
    return conv.client?.email?.split('@')[0] || 'Client';
  };

  return (
    <ShopperLayout user={user}>
      <div className="msg-page">
        <aside className="msg-sidebar">
          <div className="msg-sidebar-header">
            <h2 className="msg-sidebar-title">Messages</h2>
          </div>
          <div className="msg-conv-list">
            {loading ? (
              <p style={{ padding: 20, color: '#aaa', fontSize: '0.85rem' }}>Chargement…</p>
            ) : conversations.length === 0 ? (
              <p style={{ padding: 20, color: '#aaa', fontSize: '0.85rem' }}>Aucune conversation.</p>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  className={`msg-conv-item ${activeConv?.id === conv.id ? 'active' : ''}`}
                  onClick={() => selectConv(conv)}
                >
                  <div className="msg-conv-avatar" style={{ background: '#1a1a1a', color: '#C9A84C' }}>
                    {getNom(conv).charAt(0).toUpperCase()}
                  </div>
                  <div className="msg-conv-info">
                    <div className="msg-conv-top">
                      <span className="msg-conv-name">{getNom(conv)}</span>
                      <span className="msg-conv-time">
                        {new Date(conv.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <div className="msg-conv-bottom">
                      <span className="msg-conv-last">
                        {conv.messages?.[conv.messages.length - 1]?.contenu || 'Nouvelle conversation'}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="msg-chat">
          {!activeConv ? (
            <div className="msg-empty">Sélectionnez une conversation.</div>
          ) : (
            <>
              <div className="msg-chat-header">
                <div className="msg-chat-avatar" style={{ background: '#1a1a1a', color: '#C9A84C' }}>
                  {getNom(activeConv).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="msg-chat-name">{getNom(activeConv)}</p>
                  <p className="msg-chat-spec">Client</p>
                </div>
              </div>

              <div className="msg-body">
                {messages.map(m => (
                  <div key={m.id} className={`msg-bubble-wrap ${m.sender_id === user?.id ? 'msg-mine' : 'msg-theirs'}`}>
                    <div className="msg-bubble">
                      <p>{m.contenu}</p>
                      <span className="msg-time">
                        {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <form className="msg-input-bar" onSubmit={send}>
                <input
                  type="text"
                  className="msg-input"
                  placeholder="Écrire un message…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  autoComplete="off"
                />
                <button type="submit" className="msg-send-btn" style={{ background: '#1a1a1a', color: '#C9A84C' }} disabled={!input.trim()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </ShopperLayout>
  );
}